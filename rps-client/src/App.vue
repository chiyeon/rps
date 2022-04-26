<template>
   <div class="app">
      <div v-if="!lobbyStarted">
         <Login v-if="!inLobby" @connect="Connect" />
         <Lobby v-if="inLobby" @begin="Begin" :lobby="lobby" :selfID="userSocket.id"/>
      </div>
      <div v-if="lobbyStarted">
         <div v-if="!gameOver" class="game">
            <div class="game-info">
               <div class="game-info-matches">
                  <div>Matches this Seed:</div>
                  <div v-for="i in lobby.matches" :key="i.players[0].id">
                     {{i.players[0].name + (i.players[0].id == userSocket.id ? " (you)" : "")}} vs {{i.players[1].name + (i.players[1].id == userSocket.id ? " (you)" : "")}}
                     {{(i == lobby.matches[lobby.currentMatch]) ? "(current)" : ""}}
                  </div>
               </div>
               <div class="game-info-log">
                  <div>Game Transcript:</div>
                  <div class="game-info-log-scroll">
                     <div v-for="message in [...lobby.messages].reverse()" :key="message.id">
                        {{message.content}}
                     </div>
                  </div>
               </div>
            </div>
            
            <div class="game-options" v-if="userSocket.id == lobby.matches[lobby.currentMatch].players[0].id || userSocket.id == lobby.matches[lobby.currentMatch].players[1].id">
               <button :class="userChoice == 'rock' ? 'game-option selected' : 'game-option'" @click="Select('rock')">🪨</button>
               <button :class="userChoice == 'paper' ? 'game-option selected' : 'game-option'" @click="Select('paper')">📜</button>
               <button :class="userChoice == 'scissor' ? 'game-option selected' : 'game-option'" @click="Select('scissor')">✂️</button>
            </div>

           
         </div>
         <div v-if="gameOver" class="results">
            <div>Game is Over!</div>
            <div>Total Players: {{lobby.players.length}}</div>
            <div>Winner: {{lobby.winners.first.name}}</div>
            <div>Honored: {{lobby.winners.second.name}}</div>
         </div>
      </div>
      <ErrorMessage v-if="errorMessage != ''" @resetError="ResetError" :errorMessage="errorMessage" />
   </div>
</template>

<script>
import io from "socket.io-client";
import { ref } from "vue";

import ErrorMessage from "./components/ErrorMessage.vue"
import Lobby from "./components/Lobby.vue"
import Login from "./components/Login.vue"

export default {
   components: {
      ErrorMessage,
      Lobby,
      Login
   },
   setup() {
      const DEBUG = false;
      const ENDPOINT = DEBUG ? "http://localhost:3000" : "https://tteok-rps.herokuapp.com/"

      var errorMessage = ref("");      // text error message, displays when not blank

      var inLobby = ref(false);        // are we in lobby or not
      var lobbyStarted = ref(false);   // has lobby started the game yet
      var gameOver = ref(false);       // show end screen or not

      var userSocket = ref(null);      // ref to user socket client object
      var lobby = ref(null);           // ref to lobby object

      // game
      var userChoice = ref("");


      function Connect(_name, _lobby) {
         if (_name == "" || _lobby == "") {
            errorMessage.value = "Invalid Name/Lobby";
            return;
         }

         userSocket.value = io(ENDPOINT);

         userSocket.value.on("lobby-update", _lobby => {
            inLobby.value = true;
            lobby.value = _lobby;
            userChoice.value = "";
         })

         userSocket.value.on("connect", () => {
            console.log("Connected to Server!");

            userSocket.value.emit("login", {
               name: _name,
               id: userSocket.value.id,
               lobby: _lobby
            });
         })

         userSocket.value.on("error", (message) => {
            errorMessage.value = message;
         })

         userSocket.value.on("start-game", () => {
            lobbyStarted.value = true;
            console.log(lobby.value);
         })

         userSocket.value.on("end-game", () => {
            gameOver.value = true;
         })

         userSocket.value.on("new-message", messages => {
            lobby.value.messages = messages;
         });
      }

      function Begin() {
         userSocket.value.emit("start-game", lobby.value.name);
      }

      function ResetError() {
         errorMessage.value = "";
      }

      function Select(_choice) {
         console.log("attempting to choose...");
         userChoice.value = _choice;
         userSocket.value.emit("choose", {lobbyName: lobby.value.name, choice: _choice});
      }

      return {
         errorMessage,

         inLobby,
         lobbyStarted,
         gameOver,

         userSocket,
         lobby,

         Connect,
         Begin,
         ResetError,

         Select,

         userChoice
      }
   }
}

</script>

<style>
* {
   margin: 0;
   font-family: monospace;
}

:root {
   --background-1: #272727;
   --background-2: #3f3f3f;
   --background-3: #5b5b5b;
   --foreground-1: #ececec;
}

.app {
   width: 100vw;
   max-width: 100%;
   height: 100vh;
   max-height: 100%;

   display: flex;
   justify-content: center;
   align-items: center;

   background-color: var(--background-1);
}

.game {
   display: flex;
   flex-direction: column;
   gap: 10px;
   
   width: 500px;
   height: 400px;

   color: var(--foreground-1);
}

.game-info {
   display: grid;
   grid-template-columns: 1fr 1fr;
   min-height: 0;

   flex: 2;

   border-radius: 10px;
   padding: 10px;

   background-color: var(--background-2);

}

.game-info-matches {
   flex: 1;
   overflow-y: auto;
}

.game-info-log {
   flex: 1;
   overflow-y: auto;
}

.game-options {
   flex: 1;
   display: flex;
   flex-direction: row;

   border-radius: 10px;
   padding: 10px;

   background-color: var(--background-2);
}

.game-option {
   flex-grow: 1;
   font-size: 60px;
   
   background: none;
   border: none;

   cursor: pointer;

   opacity: 0.3;

   transition: opacity 100ms;
}

.game-option:hover {
   opacity: 0.7;
}

.game-option.selected {
   opacity: 1;
}

.results {
   padding: 10px;
   border-radius: 10px;

   background-color: var(--background-2);
   color: var(--foreground-1);
}

</style>
