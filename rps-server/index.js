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

    firebase.set_doc_path("test/testing", {
        test: "yes"
    })

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

    const create_player = (name, sprite, lobby) => {
        return {
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
                return "DUPLICATE_NAME"
            }

            doc.player_count += 1;
            doc.players.push(player_data);
            firebase.set_doc("lobbies", lobby_name, doc);
        }

        return "SUCCESS"
    }

    const create_lobby = async (lobby_name) => {
        await firebase.set_doc("lobbies", lobby_name, {
            name: lobby_name,
            player_count: 0,
            players: [],
            host_player: "",
            game_state: "lobby"
        })
    }

    const create_and_join_lobby = async (lobby_name, player_data) => {
        await firebase.set_doc("lobbies", lobby_name, {
            name: lobby_name,
            player_count: 1,
            players: [
                player_data
            ],
            host_player: player_data.name,
            game_state: "lobby"
        })
    }

    const leave_lobby = async (player_data, player_id) => {
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
            if (lobby.host_player == player_data.name) {
                lobby.host_player = lobby.players[0].name;
            }

            await firebase.set_doc("lobbies", lobby_name, lobby);
        }

        player_data.lobby = "";
        await firebase.set_doc("players", player_id, player_data);
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

            let player_data = create_player(login_packet.name, login_packet.sprite, login_packet.lobby);

            let code = await join_lobby(login_packet.lobby, player_data);

            if (code == "DUPLICATE_NAME") {
                return socket.emit("error", "Name is taken!");
            } else if (code == "SUCCESS") {
                // save player in db
                await firebase.set_doc("players", socket.id, player_data);
            }
        })
    })
}

/*
 * kickoff
 */
start()