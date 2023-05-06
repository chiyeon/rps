var express = require("express");
var http = require('http');
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 25565;
const VERSION = "1.1";

var app = express();
const server = http.createServer(app);
var io = require('socket.io')(server, {
   cors: {
      origin: "*",
   },
});

app.use(cors({
   origin: "*"
}));

app.use(express.static(path.resolve(__dirname, "./dist/")))
app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "../rps-client/dist", "index.html"));
})

server.listen(PORT, () => {
   console.log(`Started RPS Tourney Server Ver. ${VERSION} on *:${PORT}`);
});

var lobbies = {}     // list of lobbies (key = name of lobby) (value = lobby object)
var players = {}     // list of lobbies (key = socket id) (value = name of lobby)

io.on('connection', (socket) => {

   socket.on("disconnect", () => {

      if(!lobbies[players[socket.id]])
         return;
      
      // if last player leaves lobby, just close it
      if(lobbies[players[socket.id]].players.length == 1) {
         console.log(`-> Lobby '${lobbies[players[socket.id]].name}' closed.`);
         delete lobbies[players[socket.id]];
         return;
      }
      
      var shouldMigrateHost = false;      // consider whether or not migrate

      // must do a host migration -> host is leaving
      if(lobbies[players[socket.id]].host.id == socket.id) {
         shouldMigrateHost = true;
         console.log(`-> Lobby '${lobbies[players[socket.id]].name}' - Host disconnected. Migrating...`);
      }

      // remove player who is leaving from database
      lobbies[players[socket.id]].players = lobbies[players[socket.id]].players.filter(p => p.id != socket.id);
      if(shouldMigrateHost) {
         lobbies[players[socket.id]].host = lobbies[players[socket.id]].players[0];
      }

      // update players
      lobbies[players[socket.id]].players.forEach(p => {
         io.to(p.id).emit("lobby-update", lobbies[players[socket.id]])
      })
   })

   socket.on("login", (data) => {

      // check if name is valid
      if(data.name.length > 16) {
         return io.to(data.id).emit("error", "Name is too long (>16 characters)");
      }

      // TODO check profanity?

      // put into players database
      players[data.id] = data.lobby;

      // join existing lobby
      if(data.lobby in lobbies) {

         var canJoin = true;

         // check if name is already taken
         lobbies[data.lobby].players.forEach(p => {
            if(p.name == data.name) {
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

         // add to database & update other players
         lobbies[data.lobby].players.push(data);

         lobbies[data.lobby].players.forEach(p => {
            io.to(p.id).emit("lobby-update", lobbies[data.lobby]);
         })

         console.log(`-> Lobby '${data.lobby}' - ${data.name} joined lobby.`);
      } else {
         // create new lobby
         console.log(`-> Lobby '${data.lobby}' created by ${data.name}.`)

         // barebones lobby, used BEFORE game starts
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
      
      // ensure at least 2 players
      if(lobbies[lobbyName].players.length == 1) {
         return io.to(socket.id).emit("error", "At least 2 players required!");
      }
      
      console.log(`-> Lobby '${lobbyName}' has begun.`);

      // reference object
      var lobby = lobbies[lobbyName]

      // update lobby object to include game specific data
      lobby.started = true;
      lobby.matches = [];
      lobby.currentMatch = 0;
      lobby.currentWinners = [];
      lobby.transcript = "";
      lobbies[lobbyName].messages = [
         NewMessage("The game begins!")
      ]

      // set up matches

      // randomly shuffled list of all players
      var playerPool = [...lobby.players]
      for(var i = 0; i < playerPool.length; i++) {
         var target = Math.floor(Math.random() * (playerPool.length - 1));

         var temp = playerPool[target];
         playerPool[target] = playerPool[i];
         playerPool[i] = temp;
      }

      // random player advances if odd number of players
      if(playerPool.length % 2 == 1) {
         lobby.currentWinners.push(playerPool.pop());
         lobby.messages.push(NewMessage("With an odd number of players, a random player was moved to the next set of matches."))
      }

      // set up first round of matches using random list
      for(var i = 0; i < playerPool.length; i += 2) {
         lobby.matches.push(NewMatch([playerPool[i], playerPool[i + 1]]))
      }

      // announce first battle
      lobby.messages.push(NewMessage(lobby.matches[lobby.currentMatch].players[0].name + " vs " + lobby.matches[lobby.currentMatch].players[1].name + " has begun!"))

      // update all players & alert start of game
      lobby.players.forEach(p => {
         // alert player who is sitting out
         if(lobby.currentWinners.includes(p)) {
            io.to(p.id).emit("error", "With an odd number of players, you were moved to the next set of matches.");
         }
         
         io.to(p.id).emit("lobby-update", lobbies[lobbyName]);
         io.to(p.id).emit("start-game");
         io.to(p.id).emit("match-start", {players: lobby.matches[lobby.currentMatch].players, targetWins: lobby.matches[lobby.currentMatch].targetWins});
      })
   })

   // fires when player chooses something in combat
   socket.on("choose", ({lobbyName, choice}) => {
      // make sure matches exist
      if(lobbies[lobbyName].matches && lobbies[lobbyName].matches.length == 0)
         return;

      // references
      var lobby = lobbies[lobbyName];
      var currentMatch = lobby.matches[lobby.currentMatch];

      // check if player is actually in the match
      if(socket.id != currentMatch.players[0].id && socket.id != currentMatch.players[1].id) {
         return io.to(socket.id).emit("error", "You aren't in this match!");
      }

      // response must be valid
      if(!["rock", "paper", "scissor"].includes(choice)) {
         return io.to(socket.id).emit("error", "Invalid response!");
      }

      // current player between the 2 battling
      var index = (socket.id == currentMatch.players[0].id) ? 0 : 1;

      // ignore if player is spamming same choice
      if(currentMatch.choices[index] == choice) {
         return;
      }

      // update database
      currentMatch.choices[index] = choice;

      // alert all other players of choice
      lobby.messages.push(NewMessage(`${currentMatch.players[index].name} made their choice.`));
      lobby.players.forEach(p => {
         io.to(p.id).emit("new-message", lobby.messages);
      })

      // if both players have chosen
      if(currentMatch.choices.filter(c => c == "").length == 0) {
         // both players chose the same, match is a draw!
         if(currentMatch.choices[0] == currentMatch.choices[1]) {
            lobby.messages.push(NewMessage("Match was a draw!"));
            lobby.players.forEach(p => {
               io.to(p.id).emit("match-results", ({players: currentMatch.players, choices: currentMatch.choices, winner: -1, targetWins: "Draw"}));
            })

         } else {    // if it is a not a draw...
            // determine winner index
            winner = 1;
            if(currentMatch.choices[0] == "rock" && currentMatch.choices[1] == "scissor" ||
               currentMatch.choices[0] == "paper" && currentMatch.choices[1] == "rock" ||
               currentMatch.choices[0] == "scissor" && currentMatch.choices[1] == "paper") {
               winner = 0;
            }

            // increase # of wins for player
            currentMatch.wins[winner] += 1;

            // if they hit the target wins they win the match!
            if(currentMatch.wins[winner] == currentMatch.targetWins) {
               // go to next match & add player to winners
               lobby.currentMatch += 1;
               lobby.currentWinners.push(currentMatch.players[winner])

               lobby.messages.push(NewMessage(currentMatch.players[winner].name + " has won the match!"));

               // if that was the final match of the tier, then check some things
               if(lobby.currentMatch == lobby.matches.length) {
                  lobby.currentMatch = 0;
                  
                  // if last person left, winner ! game is over.
                  if(lobby.currentWinners.length == 1) {
                     lobby.winners = {
                        first: currentMatch.players[winner],
                        second: currentMatch.players[(winner == 0) ? 1 : 0]
                     }

                     lobby.messages.push(NewMessage("The tournament is over."));
                     lobby.messages.push(NewMessage(currentMatch.players[winner].name + " is victorious!"));

                     var transcript = "";
                     [...lobby.messages].reverse().forEach(msg => {
                        transcript += msg.content + "\n"
                     })

                     lobby.transcript = transcript;
                     lobby.players.forEach(p => {
                        io.to(p.id).emit("lobby-update", lobby);
                        io.to(p.id).emit("end-game", currentMatch.players[winner].name);
                     })

                     return;
                  } else {
                     // otherwise continue to next seed! make new matches
                     lobby.matches = []

                     // same as before, if odd number 1 random person advances
                     var advancingPlayer = null;
                     if(lobby.currentWinners.length % 2 == 1) {
                        lobby.messages.push(NewMessage("Given the odd number of players, a random player was chosen to advance to the next tier..."));
                        advancingPlayer = lobby.currentWinners[0]
                        lobby.currentWinners = lobby.currentWinners.filter(w => w != advancingPlayer);
                     }

                     for(var i = 0; i < lobby.currentWinners.length; i+= 2) {
                        var targetWins = (lobby.currentWinners.length == 2 && advancingPlayer == null) ? 3 : 2
                        lobby.matches.push(NewMatch([lobby.currentWinners[i], lobby.currentWinners[i + 1]], targetWins))
                     }

                     lobby.currentWinners = [];
                     if(advancingPlayer != null)
                        lobby.currentWinners.push(advancingPlayer);

                     lobby.players.forEach(p => {
                        if(advancingPlayer == p) {
                           io.to(p.id).emit("error", "With an odd number of players, you will sit out this seed and play in the next.");
                        }
                        io.to(p.id).emit("lobby-update", lobby);
                     })
                  }
               }

               // tell clients to show match results as normal
               lobby.players.forEach(p => {
                  io.to(p.id).emit("match-results", ({players: currentMatch.players, choices: currentMatch.choices, winner: winner, targetWins: currentMatch.players[winner].name + "\nWon the Match!"}));
               })

               if(lobby.matches.length > 0) {
                  lobby.messages.push(NewMessage(lobby.matches[lobby.currentMatch].players[0].name + " vs " + lobby.matches[lobby.currentMatch].players[1].name + " has begun!"))
                  lobby.players.forEach(p => {
                     io.to(p.id).emit("match-start", {players: lobby.matches[lobby.currentMatch].players, targetWins: lobby.matches[lobby.currentMatch].targetWins});
                  })
               }
            } else {
               lobby.messages.push(NewMessage(currentMatch.players[winner].name + " won the round! (" + currentMatch.wins[winner] + "/" + currentMatch.targetWins + ")"));
               lobby.players.forEach(p => {
                  io.to(p.id).emit("match-results", ({players: currentMatch.players, choices: currentMatch.choices, winner: winner, targetWins: currentMatch.players[winner].name + " Wins!\n" + currentMatch.wins[winner] + "/" + currentMatch.targetWins}));
               })
            }

            // now alert players
            lobby.players.forEach(p => {
               io.to(p.id).emit("lobby-update", lobby);
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
