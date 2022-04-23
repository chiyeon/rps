const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/index.html");
});

var players = [];

io.on("connection", (socket) => {
   if(players.length >= 2) {
      socket.disconnect();
      console.log("Player attempted to join but lobby is full.");
      return;
   }

   console.log(`${socket.id} connected. (Currently ${players.length + 1})`);

   players.push({
      id: socket.id,
      choice: ""
   })

   if(players.length == 2) {
      io.emit("status", {message: "gamestart"});
   } else {
      io.emit("status", {message: "waiting"});

   }

   socket.on("disconnect", () => {
      io.emit("status", {message: "waiting"});

      players = players.filter(player => player.id != socket.id);

      console.log(`${socket.id} disconnected. (${players.length} currently)`);
   })

   socket.on("select", (choice) => {
      console.log(socket.id + " selected " + choice);
      players.find(p => p.id == socket.id).choice = choice;

      var ready = true;
      players.forEach(p => {
         if(p.choice == "")
            ready = false;
      })
      if(ready) {
         console.log("game is over")

         var winner = "none";

         for(var curr = 0; curr < players.length; curr++) {
            var other = (curr == 0) ? 1 : 0;

            if(players[curr].choice == "rock" && players[other].choice == "scissors" ||
               players[curr].choice == "scissors" && players[other].choice == "paper" ||
               players[curr].choice == "paper" && players[other].choice == "rock") {
               winner = players[curr].id;
            }
         }

         io.emit("status",
         {
            message: "gameend",
            winner: winner,
            players: players
         });
      }
   })
});

server.listen(3000, () => {
   console.log("Started server on 3000.");
})