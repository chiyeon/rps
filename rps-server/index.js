/*
 * setup
 */
const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // TODO CHANGE
        methods: ["GET", "POST"]
    }
})

const cors = require("cors")
const path = require("path")
const firebase = require("./firebase.js")

/*
 * engine info
 */
const PORT = process.env.PORT || 3000
const VERSION = "0.1"

const sprites = "EFLNQWYZaksuvwxy".split("")

/*
 * Game stuff
 */
const ROCK      = 0b001
const PAPER     = 0b010
const SCISSORS  = 0b100;

/*
 * functions
 */

// prints stylized message to console
const print = (message) => {
    let now = new Date()
    console.log(`[${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]: ${message}`)
 }
 

const start = () => {
    // enable cors for server
    app.use(cors({
        origin: "*", // TODO CHANGE
        methods: ["GET", "POST"]
    }))

    firebase.delete_collection("lobbies");
    firebase.delete_collection("players");

    // set up socket definitions
    define_socket()

    /*
     * this is for serving webpage
    app.use(express.static(path.resolve(__dirname, "./dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./dist", "index.html"))
    }) */

    server.listen(PORT, () => {
        print("Starting on port " + PORT)
    })
}

const define_socket = () => {

    const create_match = (players, target_wins = 2) => {
        return {
            players,
            choices: [0, 0],
            wins: [0, 0],
            target_wins,
            tier: 0
        }
    }

    const create_player = (id, name, lobby) => {
        return {
            id,
            name,
            sprite: sprites[Math.floor(Math.random() * sprites.length)],
            lobby
        }
    }

    const join_lobby = async (lobby_name, player_data) => {
        let doc = await firebase.get_doc("lobbies", lobby_name)
        if (doc == undefined) {
            create_and_join_lobby(lobby_name, player_data);
        } else {
            if (doc.players.find(a => a.name == player_data.name)) {
                // same name already in the lobby!
                return io.to(player_data.id).emit("error", "Name is taken.");
            }

            // ensure lobby is waiting for players
            if (doc.game_state != "lobby") {
                return io.to(player_data.id).emit("error", "Lobby has already started.");
            }

            doc.player_count += 1;
            doc.players.push(player_data);

            doc.players.forEach(p => {
                io.to(p.id).emit("lobby-update", doc);
            })

            await firebase.set_doc("lobbies", lobby_name, doc);
        }
    }

    const create_lobby = async (lobby_name) => {
        await firebase.set_doc("lobbies", lobby_name, {
            name: lobby_name,
            player_count: 0,
            players: [],
            host_player: {},
            game_state: "lobby"
        })
    }

    const create_and_join_lobby = async (lobby_name, player_data) => {
        let new_lobby = {
            name: lobby_name,
            player_count: 1,
            players: [
                player_data
            ],
            host_player: player_data,
            game_state: "lobby"
        }
        await firebase.set_doc("lobbies", lobby_name, new_lobby)
        io.to(player_data.id).emit("lobby-update", new_lobby);
    }

    const leave_lobby = async (player_data) => {
        // get lobby first
        let lobby_name = player_data.lobby;
        let lobby = await firebase.get_doc("lobbies", lobby_name);

        if (lobby === undefined)
            return console.log("Error! Tried to leave lobby that doesn't exist!");
        
        if (lobby.player_count == 1) {
            // remove lobby
            await firebase.delete_doc("lobbies", lobby_name);
        } else {
            lobby.player_count -= 1;
            lobby.players = lobby.players.filter(p => p.name != player_data.name)
            
            // migrate if host is leaving
            if (lobby.host_player.id == player_data.id) {
                lobby.host_player = lobby.players[0];
            }

            // update the entire lobby
            lobby.players.forEach(p => {
                io.to(p.id).emit("lobby-update", lobby);
            })

            await firebase.set_doc("lobbies", lobby_name, lobby);
        }

        player_data.lobby = "";
        await firebase.set_doc("players", player_data.id, player_data);
    }

    io.on("connection", (socket) => {
        socket.on("disconnect", async () => {
            let player_data = await firebase.get_doc("players", socket.id);
            if (player_data == undefined) return console.log("invalid player");
            await leave_lobby(player_data, socket.id);
            firebase.delete_doc("players", socket.id);
        })

        socket.on("login", async (login_packet) => {
            if (login_packet.name.length > 16) {
                return socket.emit("error", "Name is too long.");
            }

            // todo profanity check ?

            let player_data = create_player(socket.id, login_packet.name, login_packet.lobby);

            await join_lobby(login_packet.lobby, player_data);
            // save player in db
            await firebase.set_doc("players", socket.id, player_data);
        })

        socket.on("new-sprite", async () => {
            let player = await firebase.get_doc("players", socket.id);
            let lobby = await firebase.get_doc("lobbies", player.lobby);

            // get random sprite
            let new_sprite = sprites[Math.floor(Math.random() * sprites.length)];

            player.sprite = new_sprite;

            // sob skull coffin
            let p_index = lobby.players.indexOf(lobby.players.find(p => p.id == player.id));
            lobby.players[p_index].sprite = new_sprite;

            lobby.players.forEach(p => {
                io.to(p.id).emit("lobby-update", lobby)
            })

            await firebase.set_doc("lobbies", player.lobby, lobby);
        })

        socket.on("start-game", async (lobby_name) => {
            let lobby = await firebase.get_doc("lobbies", lobby_name);
            let player = await firebase.get_doc("players", socket.id);

            // only allow host to start game
            if (socket.id != lobby.host_player.id) {
                return socket.emit("error", "Invalid user!");
            }

            // make sure we are starting the proper lobby
            if (player.lobby != lobby_name) {
                return socket.emit("error", "Invalid lobby!");
            }

            if (lobby.player_count < 2) {
                return socket.emit("error", "At least 2 players required.");
            }

            if (lobby.game_state != "lobby") {
                return socket.emit("error", "Lobby already started!");
            }

            lobby.game_state = "tournament"
            lobby.matches = []
            lobby.current_match = 0;
            lobby.current_winners = [];
            lobby.messages = []

            // set up matches

            // randomly shuffle list of all players
            let player_pool = [...Array(lobby.players.length).keys()]
            for (let i = 0; i < player_pool.length; i++) {
                let target = Math.floor(Math.random() * (player_pool))

                let temp = player_pool[target];
                player_pool[target] = player_pool[i];
                player_pool[i] = temp;
            }

            // a random player advances if odd number of players
            if (player_pool.length % 2 == 1) {
                lobby.current_winners.push(player_pool.pop());
            }

            // set up matches randomly
            for(let i = 0; i < player_pool.length; i+= 2) {
                lobby.matches.push(create_match([player_pool[i], player_pool[i+1]]))
            }

            // udate all players
            for (let i = 0; i < lobby.players.length; i++) {
                let p = lobby.players[i];

                if (lobby.current_winners.includes[i]) {
                    io.to(p.id).emit("error", "Due to uneven matches, you will be sitting out this round.");
                }

                io.to(p.id).emit("start-game", lobby);  // update lobby

                let player_indexes = lobby.matches[lobby.current_match].players;
                io.to(p.id).emit("match-start", {
                    players: [
                        lobby.players[player_indexes[0]],
                        lobby.players[player_indexes[1]]
                    ],
                    target_wins: lobby.matches[lobby.current_match].target_wins
                })
                // start match
            }

            await firebase.set_doc("lobbies", lobby_name, lobby);
        })
    })
}

/*
 * kickoff
 */
start()