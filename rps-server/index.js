var express = require("express");
var http = require('http');
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 3000;

var app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);

app.use(cors());

app.use(express.static(path.resolve(__dirname, "./dist/")))
app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "./dist", "index.html"));
})

server.listen(PORT, () => {
   console.log(`Started Server on *:${PORT}`);
});

var lobbies = {}     // list of lobbies (key = name of lobby) (value = lobby object)
var players = {}     // list of lobbies (key = socket id) (value = name of lobby)

io.on('connection', (socket) => {
   console.log(`${socket.id} connected!`);

   socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected!`);

      if(!lobbies[players[socket.id]])
         return;
      
      if(lobbies[players[socket.id]].players.length == 1) {
         // last player to leave, just close lobby
         console.log(`Closing lobby '${lobbies[players[socket.id]].name}'`);
         delete lobbies[players[socket.id]];
         return;
      }
      
      var shouldMigrateHost = false;

      if(lobbies[players[socket.id]].host.id == socket.id) {
         // must do a host migration -> host is leaving
         shouldMigrateHost = true;
         console.log(`Host left lobby '${lobbies[players[socket.id]].name}'! Migrating...`);
      }

      lobbies[players[socket.id]].players = lobbies[players[socket.id]].players.filter(p => p.id != socket.id);
      if(shouldMigrateHost) {
         lobbies[players[socket.id]].host = lobbies[players[socket.id]].players[0];
      }
      lobbies[players[socket.id]].players.forEach(p => {
         io.to(p.id).emit("lobby-update", lobbies[players[socket.id]])
      })
   })

   socket.on("login", (data) => {
      console.log(`connection from ${data.name}`)

      players[data.id] = data.lobby;

      if(data.lobby in lobbies) {
         // join existing lobby

         var canJoin = true;

         // check if name exists
         lobbies[data.lobby].players.forEach(p => {
            if(p.name == data.name) {
               console.log("duplicate name!");
               io.to(data.id).emit("error", "Name is taken!");
               canJoin = false;
            }
         })

         // check if lobby started
         if(lobbies[data.lobby].started) {
            io.to(data.id).emit("error", "Lobby has already started!");
            return;
         }

         if(!canJoin) {
            return;
         }

         lobbies[data.lobby].players.push(data);

         lobbies[data.lobby].players.forEach(p => {
            io.to(p.id).emit("lobby-update", lobbies[data.lobby]);
         })
      } else {
         // create new lobby
         console.log(`Creating lobby '${data.lobby}'...`)

         lobbies[data.lobby] = {
            name: data.lobby,
            players: [
               data
            ],
            host: data,
            started: false
         }

         console.log(data.id);
         io.to(data.id).emit("lobby-update", lobbies[data.lobby]);
      }
   });

   socket.on("start-game", (lobbyName) => {
      // only allow host to start game
      if(socket.id != lobbies[lobbyName].host.id)
         return io.to(socket.id).emit("error", "Nice try :)");
      
      if(lobbies[lobbyName].players.length == 1) {
         return io.to(socket.id).emit("error", "At least 2 players required!");
      }
      
      console.log(`Lobby '${lobbyName}' started!`);

      // set up matches
      var playerPool = [...lobbies[lobbyName].players]
      var matches = [];
      // shuffle player pool
      for(var i = 0; i < playerPool.length; i++) {
         var target = Math.floor(Math.random() * (playerPool.length - 1));

         var temp = playerPool[target];
         playerPool[target] = playerPool[i];
         playerPool[i] = temp;
      }
      // set up matches
      var total = playerPool.length % 2 == 0 ? playerPool.length : playerPool.length + 1;
      for(var i = 0; i < total; i += 2) {
         matches.push({
            players: [
               playerPool[i],
               playerPool[i + 1]
            ],
            choices: [
               "",
               ""
            ],
            tier: 0
         })
      }
      
      lobbies[lobbyName].started = true;
      lobbies[lobbyName].matches = matches;
      lobbies[lobbyName].currentMatch = 0;
      lobbies[lobbyName].players.forEach(p => {
         io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
         io.to(p.id).emit("start-game");
      })
   })

   socket.on("choose", ({lobbyName, choice}) => {
      var currentMatch = lobbies[lobbyName].matches[lobbies[lobbyName].currentMatch];
      if(socket.id != currentMatch.players[0].id && socket.id != currentMatch.players[1].id) {
         return io.to(socket.id).emit("error", "You aren't in this match!");
      }

      if(!["rock", "paper", "scissor"].includes(choice)) {
         return io.to(socket.id).emit("error", "Invalid response!");
      }

      var index = (socket.id == currentMatch.players[0].id) ? 0 : 1;

      currentMatch.choices[index] = choice;

      console.log(`Player ${currentMatch.players[index].name} chose ${choice}`);

      if(currentMatch.choices.filter(c => c == "").length == 0) {
         // players have both chosen !
         if(currentMatch.choices[0] == currentMatch.choices[1]) {
            // draw
            lobbies[lobbyName].players.forEach(p => {
               io.to(p.id).emit("error", "Match was a draw!");
            })
            currentMatch.choices = [
               "",
               ""
            ]
         } else {
            winner = 1;
            if(currentMatch.choices[0] == "rock" && currentMatch.choices[1] == "scissor" ||
               currentMatch.choices[0] == "paper" && currentMatch.choices[1] == "rock" ||
               currentMatch.choices[0] == "scissor" && currentMatch.choices[1] == "paper") {
                  winner = 0;
               }
            
            currentMatch.winner = currentMatch.players[winner];
            lobbies[lobbyName].currentMatch += 1;
            if(lobbies[lobbyName].currentMatch == lobbies[lobbyName].matches.length) {
               lobbies[lobbyName].currentMatch = 0;
            }
            lobbies[lobbyName].players.forEach(p => {
               io.to(p.id).emit("error", currentMatch.players[winner].name + " has won!");
               io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
            })
         }
      }
   })
});