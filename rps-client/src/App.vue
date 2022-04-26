<template>
   <div class="app">
      <div v-if="!lobbyStarted">
         <Login v-if="!inLobby" @connect="Connect" />
         <Lobby v-if="inLobby" @begin="Begin" :lobby="lobby" :selfID="userSocket.id"/>
      </div>
      <Game
         v-if="lobbyStarted"
         :lobby="lobby"
         :userSocket="userSocket"
         :userChoice="userChoice"
         :gameOver="gameOver"
         @select="Select"
      />
      <ErrorMessage
         v-if="errorMessage != ''"
         @resetError="ResetError"
         :errorMessage="errorMessage" 
      />
   </div>
</template>

<script>
import io from "socket.io-client";
import { ref } from "vue";

import ErrorMessage from "./components/ErrorMessage.vue"
import Lobby from "./components/Lobby.vue"
import Login from "./components/Login.vue"
import Game from "./components/Game.vue"

export default {
   components: {
      ErrorMessage,
      Lobby,
      Login,
      Game
   },
   setup() {
      const DEBUG = true;
      const ENDPOINT = DEBUG ? "http://localhost:3000" : "https://tteok-rps.herokuapp.com/"

      var errorMessage = ref("");      // text error message, displays when not blank
      var userChoice = ref("");        // rock, paper, or scissor (whichever user chosen)

      var inLobby = ref(false);        // are we in lobby or not
      var lobbyStarted = ref(false);   // has lobby started the game yet
      var gameOver = ref(false);       // show end screen or not

      var userSocket = ref(null);      // ref to user socket client object
      var lobby = ref(null);           // ref to lobby object

      function Connect(_name, _lobby) {
         if (_name == "" || _lobby == "") {
            errorMessage.value = "Invalid Name/Lobby";
            return;
         }

         userSocket.value = io(ENDPOINT);

         // update local copy of lobby
         userSocket.value.on("lobby-update", _lobby => {
            inLobby.value = true;
            lobby.value = _lobby;
            userChoice.value = "";
         })

         // send login req on successful connection
         userSocket.value.on("connect", () => {
            console.log("Connected to Server!");

            userSocket.value.emit("login", {
               name: _name,
               id: userSocket.value.id,
               lobby: _lobby
            });
         })

         // render errorMessage when not ""
         userSocket.value.on("error", (message) => {
            errorMessage.value = message;
         })

         // change visbility
         userSocket.value.on("start-game", () => {
            lobbyStarted.value = true;
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
         userChoice.value = _choice;
         userSocket.value.emit("choose", {lobbyName: lobby.value.name, choice: _choice});
      }

      return {
         errorMessage,
         userChoice,

         inLobby,
         lobbyStarted,
         gameOver,

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

</style>
