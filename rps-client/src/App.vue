<template>
   <div class="app">
      <div v-if="!lobbyStarted">
         <Login v-if="!inLobby" @connect="Connect" />
         <Lobby v-if="inLobby" @begin="Begin" :lobby="lobby" :selfID="userSocket.id"/>
      </div>
      <div v-if="lobbyStarted">
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
      const ENDPOINT = "http://127.0.0.1:3000"

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
         })
      }

      function Begin() {
         userSocket.value.emit("start-game", lobby.value.name);
      }

      function ResetError() {
         errorMessage.value = "";
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

</style>
