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

      if(data.name.length > 10) {
         return io.to(data.id).emit("error", "Name is too long (>10 characters)");
      }

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

      // random advances if odd number
      lobbies[lobbyName].currentWinners = (playerPool.length % 2 == 1) ? [playerPool.pop()] : [];

      for(var i = 0; i < playerPool.length; i += 2) {
         matches.push(NewMatch([playerPool[i], playerPool[i + 1]]))
      }
      
      lobbies[lobbyName].started = true;
      lobbies[lobbyName].matches = matches;
      lobbies[lobbyName].currentMatch = 0;
      lobbies[lobbyName].messages = [
         NewMessage("The game begins!"),
         NewMessage(lobbies[lobbyName].matches[lobbies[lobbyName].currentMatch].players[0].name + " vs " + lobbies[lobbyName].matches[lobbies[lobbyName].currentMatch].players[1].name + " has begun!")
      ]

      lobbies[lobbyName].players.forEach(p => {
         io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
         io.to(p.id).emit("start-game");

         if(lobbies[lobbyName].currentWinners.includes(p)) {
            io.to(p.id).emit("error", "With an odd number of players, you were moved to the next seed.");
         }
      })
   })

   socket.on("choose", ({lobbyName, choice}) => {
      var currentMatch = lobbies[lobbyName].matches[lobbies[lobbyName].currentMatch];

      // check if player is actually in the match
      if(socket.id != currentMatch.players[0].id && socket.id != currentMatch.players[1].id) {
         return io.to(socket.id).emit("error", "You aren't in this match!");
      }

      // response must be valid
      if(!["rock", "paper", "scissor"].includes(choice)) {
         return io.to(socket.id).emit("error", "Invalid response!");
      }

      var index = (socket.id == currentMatch.players[0].id) ? 0 : 1;

      // ignore if player is spamming same choice
      if(currentMatch.choices[index] == choice) {
         return;
      }

      currentMatch.choices[index] = choice;

      console.log(`Player ${currentMatch.players[index].name} chose ${choice}`);

      lobbies[lobbyName].messages.push(NewMessage(`${currentMatch.players[index].name} made their choice.`));
      lobbies[lobbyName].players.forEach(p => {
         io.to(p.id).emit("new-message", lobbies[lobbyName].messages);
      })

      // if both players have chosen
      if(currentMatch.choices.filter(c => c == "").length == 0) {
         // both players chose the same, match is a draw!
         if(currentMatch.choices[0] == currentMatch.choices[1]) {
            lobbies[lobbyName].messages.push(NewMessage("Match was a draw!"));
            lobbies[lobbyName].players.forEach(p => {
               io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
            })

         } else {    // if it is a not a draw...
            // determine winner index
            winner = 1;
            if(currentMatch.choices[0] == "rock" && currentMatch.choices[1] == "scissor" ||
               currentMatch.choices[0] == "paper" && currentMatch.choices[1] == "rock" ||
               currentMatch.choices[0] == "scissor" && currentMatch.choices[1] == "paper") {
               winner = 0;

               currentMatch.choices = [
                  "",
                  ""
               ]
            }

            // increase # of wins for player
            currentMatch.wins[winner] += 1;

            // if they hit the target wins they win the match!
            if(currentMatch.wins[winner] == currentMatch.targetWins) {
               // go to next match & add player to winners
               lobbies[lobbyName].currentMatch += 1;
               lobbies[lobbyName].currentWinners.push(currentMatch.players[winner])

               lobbies[lobbyName].messages.push(NewMessage(currentMatch.players[winner].name + " has won the match!"));

               // if that was the final match of the tier, then check some things
               if(lobbies[lobbyName].currentMatch == lobbies[lobbyName].matches.length) {
                  lobbies[lobbyName].currentMatch = 0;
                  
                  // if last person left, winner ! game is over.
                  if(lobbies[lobbyName].currentWinners.length == 1) {
                     lobbies[lobbyName].winners = {
                        first: currentMatch.players[winner],
                        second: currentMatch.players[(winner == 0) ? 1 : 0]
                     }

                     lobbies[lobbyName].players.forEach(p => {
                        io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
                        io.to(p.id).emit("end-game");
                     })
                  } else {
                     // otherwise continue to next seed! make new matches
                     lobbies[lobbyName].matches = []

                     // same as before, if odd number 1 random person advances
                     var advancingPlayer = null;
                     if(lobbies[lobbyName].currentWinners.length % 2 == 1) {
                        console.log("odd number of players! picking random to advance...");
                     lobbies[lobbyName].messages.push(NewMessage("Given the odd number of players, a random player was chosen to advance to the next tier..."));
                        advancingPlayer = lobbies[lobbyName].currentWinners[0]
                        lobbies[lobbyName].currentWinners = lobbies[lobbyName].currentWinners.filter(w => w != advancingPlayer);
                     }

                     for(var i = 0; i < lobbies[lobbyName].currentWinners.length; i+= 2) {
                        var targetWins = (lobbies[lobbyName].currentWinners.length == 2 && advancingPlayer == null) ? 3 : 2
                        lobbies[lobbyName].matches.push(NewMatch([lobbies[lobbyName].currentWinners[i], lobbies[lobbyName].currentWinners[i + 1]], targetWins))
                     }

                     lobbies[lobbyName].currentWinners = [];
                     if(advancingPlayer != null)
                        lobbies[lobbyName].currentWinners.push(advancingPlayer);

                     lobbies[lobbyName].players.forEach(p => {
                        if(advancingPlayer == p) {
                           io.to(p.id).emit("error", "With an odd number of players, you will sit out this seed and play in the next.");
                        }
                        io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
                     })
                  }
               }

               lobbies[lobbyName].messages.push(NewMessage(lobbies[lobbyName].matches[lobbies[lobbyName].currentMatch].players[0].name + " vs " + lobbies[lobbyName].matches[lobbies[lobbyName].currentMatch].players[1].name + " has begun!"))
            } else {
               lobbies[lobbyName].messages.push(NewMessage(currentMatch.players[winner].name + " won the round! (" + currentMatch.wins[winner] + "/" + currentMatch.targetWins + ")"));
            }

            // now alert players
            lobbies[lobbyName].players.forEach(p => {
               io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
            })
         }
         currentMatch.choices = [
            "",
            ""
         ]
      }
   })
});

function NewMatch(players, targetWins = 2) {
   return {
      players: players,
      choices: [
         "",
         ""
      ],
      wins: [
         0,
         0
      ],
      targetWins: targetWins,
      tier: 0
   }
}

function NewMessage(_content) {
   var d = new Date();
   return {
      id: Math.random() * 100000,
      content: "[" + d.getHours() + ":" + d.getMinutes() + "] " + _content
   }
}