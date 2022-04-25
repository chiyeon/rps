var app = require('express')();
var http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
var io = require('socket.io')(http);

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
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
         return;
      
      console.log(`Lobby '${lobbyName}' started!`);
      
      lobbies[lobbyName].started = true;
      lobbies[lobbyName].players.forEach(p => {
         io.to(p.id).emit("start-game");
      })
   })
});