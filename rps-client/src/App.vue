<template>
   <div class="app">
      <div class="lobby-setting" v-if="!lobbyStarted">
         <div v-if="loading" class="loading-screen">
            <p>Loading...</p>
            <p class="hint">May take a moment for servers to start.</p>
         </div>
         <div class="title">
         <pre class="title"> ___ ___  ___                        
| _ \ _ \/ __|                       
|   /  _/\__ \                       
|_|_\_|__|___/  _ ___ _  _ _____   __
|_   _/ _ \| | | | _ \ \| | __\ \ / /
  | || (_) | |_| |   / .` | _| \ V / 
|_| \___/ \___/|_|_\_|\_|___| |_|</pre>
         <br>
         </div>
         <Login v-if="!inLobby" @connect="Connect" />
         <Lobby v-if="inLobby" @begin="Begin" :lobby="lobby" :selfID="userSocket.id"/>
         <div class="version-info">
            Ver. {{VERSION}} on {{DEBUG ? "Test Server" : "Live Server"}}
         </div>
      </div>
      <Game
         v-if="lobbyStarted"
         :lobby="lobby"
         :userSocket="userSocket"
         :userChoice="userChoice"
         :gameOver="gameOver"
         :matchInfo="matchInfo"
         :matchResults="matchResults"
         :tourneyResults="tourneyResults"
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
      Game,
   },
   setup() {
      const VERSION = ref("a1.4");

      const DEBUG = ref(false);
      const ENDPOINT = DEBUG.value ? "https://chiyeon-fluffy-spoon-9j67xwg95xg3x6w4-25565.preview.app.github.dev/" : "https://rps-tourney.onrender.com"

      var errorMessage = ref("");      // text error message, displays when not blank
      var userChoice = ref("");        // rock, paper, or scissor (whichever user chosen)

      var inLobby = ref(false);        // are we in lobby or not
      var lobbyStarted = ref(false);   // has lobby started the game yet
      var gameOver = ref(false);       // show end screen or not
      var matchInfo = ref(null);    // collection of match information
      var matchResults = ref(null);    // match results, whether end of round or match
      var tourneyResults = ref(null);  // results at the very end of the tournament
      var loading = ref(false)      // are we loading scren

      var userSocket = ref(null);      // ref to user socket client object
      var lobby = ref(null);           // ref to lobby object

      function Connect(_name, _lobby) {
         if (_name == "" || _lobby == "") {
            errorMessage.value = "Invalid Name/Lobby";
            return;
         }

         if (loading.value) return;

         // show loading screen
         loading.value = true

         userSocket.value = io(ENDPOINT);

         // update local copy of lobby
         userSocket.value.on("lobby-update", _lobby => {
            inLobby.value = true;
            lobby.value = _lobby;
            userChoice.value = "";
            loading.value = false
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

         userSocket.value.on("end-game", (_results) => {
            gameOver.value = true;
            tourneyResults.value = _results;
         })

         userSocket.value.on("new-message", messages => {
            lobby.value.messages = messages;
         });

         userSocket.value.on("match-start", ({players, targetWins}) => {
            matchInfo.value = {
               players: players,
               targetWins: targetWins
            }
         });

         userSocket.value.on("match-results", ({players, choices, winner, targetWins}) => {
            matchResults.value = {
               players: players,
               choices: choices,
               winner: winner,
               targetWins: targetWins
            }
         })
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
         VERSION,
         DEBUG,

         errorMessage,
         userChoice,

         inLobby,
         lobbyStarted,
         gameOver,
         matchInfo,
         matchResults,
         tourneyResults,
         loading,

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
   --background-1: #867070;
   --background-2: #D5B4B4;
   --background-3: #E4D0D0;
   --foreground-1: #F5EBEB;
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

.title {
   text-align: center;
   color: var(--foreground-1);
   
}

.version-info {
   color: var(--foreground-1);
   position: fixed;
   left: 50%;
   bottom: 1%;
   text-align: center;
   transform: translateX(-50%);
}

.lobby-setting {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   padding-bottom: 75px;
}

.loading-screen {
   position: fixed;
   z-index: 10;
   width: 100vw;
   height: 100vh;

   background-color: #272727;

   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;

   color: white;
}

.loading-screen .hint {
   font-style: italic;
}

</style>
