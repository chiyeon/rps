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

    const create_player = (id, name, sprite, lobby) => {
        return {
            id,
            name,
            sprite,
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

            let player_data = create_player(socket.id, login_packet.name, login_packet.sprite, login_packet.lobby);

            await join_lobby(login_packet.lobby, player_data);
            // save player in db
            await firebase.set_doc("players", socket.id, player_data);
        })
    })
}

/*
 * kickoff
 */
start()