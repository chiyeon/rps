<template>
   <div class="app">
      <div v-if="!lobbyStarted">
         <Login v-if="!inLobby" @connect="Connect" />
         <Lobby v-if="inLobby" @begin="Begin" :lobby="lobby" :selfID="userSocket.id"/>
      </div>
      <div v-if="lobbyStarted">
         <div class="game">
            <div v-for="i in lobby.matches" :key="i.players[0].id">
               {{i.players[0].name + (i.players[0].id == userSocket.id ? " (you)" : "")}} vs {{i.players[1].name + (i.players[1].id == userSocket.id ? " (you)" : "")}}
               {{(i == lobby.matches[lobby.currentMatch]) ? "(current)" : ""}}
            </div>
            <div v-if="userSocket.id == lobby.matches[lobby.currentMatch].players[0].id || userSocket.id == lobby.matches[lobby.currentMatch].players[1].id">
               <div class="options-box">
                  <button class="option" @click="Select('rock')">🪨</button>
                  <button class="option" @click="Select('paper')">📜</button>
                  <button class="option" @click="Select('scissor')">✂️</button>
               </div>
            </div>
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

      var userSocket = ref(null);      // ref to user socket client object
      var lobby = ref(null);           // ref to lobby object

      function Connect(_name, _lobby) {
         if (_name == "" || _lobby == "") {
            errorMessage.value = "Invalid Name/Lobby";
            return;
         }

         userSocket.value = io(ENDPOINT);

         userSocket.value.on("lobby-update", _lobby => {
            inLobby.value = true;
            lobby.value = _lobby;
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
      }

      function Begin() {
         userSocket.value.emit("start-game", lobby.value.name);
      }

      function ResetError() {
         errorMessage.value = "";
      }

      function Select(_choice) {
         console.log("attempting to choose...");
         userSocket.value.emit("choose", {lobbyName: lobby.value.name, choice: _choice});
      }

      return {
         errorMessage,

         inLobby,
         lobbyStarted,

         userSocket,
         lobby,

         Connect,
         Begin,
         ResetError,

         Select,
      }
   }
}

</script>

<style>
* {
   margin: 0;
   font-family: monospace;
}

.app {
   width: 100vw;
   max-width: 100%;
   height: 100vh;
   max-height: 100%;

   display: flex;
   justify-content: center;
   align-items: center;

   background-color: rgb(42, 42, 42);
}

.game {
   color: white;
}

</style>
