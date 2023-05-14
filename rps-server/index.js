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
    const disconnect = () => {

    }

    io.on("connection", (socket) => {
        socket.on("disconnect", disconnect)
        // more ...
    })
}

/*
 * kickoff
 */
start()