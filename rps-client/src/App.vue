<template>
   <LoadingView v-if="loading" />
   <div class="lobby-setting" v-if="!lobbyStarted">
      <Login 
         class="center"
         v-if="!inLobby"
         @connect="Connect"
      />
      <Lobby
         class="center"
         v-if="inLobby"
         @begin="Begin"
         @exit="QuitLobby"
         :lobby="lobby"
         :selfID="userSocket.id"
      />
      <p class="version-info">
         Ver. {{VERSION}} {{DEBUG ? "(Testing Server)" : "(Live Server)"}}
      </p>
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
</template>

<script setup>
import io from "socket.io-client";
import { ref } from "vue";

import ErrorMessage from "./components/ErrorMessage.vue"
import Lobby from "./components/LobbyView.vue"
import LoadingView from "./components/LoadingView.vue"
import Login from "./components/LoginView.vue"
import Game from "./components/GameView.vue"

const VERSION = ref("1.4");

const DEBUG = ref(false);
const ENDPOINT = DEBUG.value ? "http://localhost:25565" : "https://rps-tourney.onrender.com"

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
      loading.value = false;
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

function QuitLobby() {
   userSocket.value.disconnect()
   inLobby.value = false;
}

function ResetError() {
   errorMessage.value = "";
}

function Select(_choice) {
   userChoice.value = _choice;
   userSocket.value.emit("choose", {lobbyName: lobby.value.name, choice: _choice});
}

</script>

<style>
@font-face {
   font-family: "Icons";
   src: url(assets/fonts/Pixel\ Icons\ Compilation.ttf);
}

@font-face {
   font-family: "Daydream";
   src: url(assets/fonts/Daydream.ttf);
}

@font-face {
   font-family: "Pixel Arial";
   src: url(assets/fonts/PIXEARG_.TTF);
}

:root {
   --background-1: #867070;
   --background-2: #D5B4B4;
   --background-3: #E4D0D0;
   --foreground-1: #F5EBEB;
}

h1, h2 {
   font-family: "Daydream", monospace;
   font-weight: normal;
}

h1 {
   font-size: 48px;
}

h3, a, pre, p, button, input {
   font-family: "Pixel Arial", monospace;
   color: var(--foreground-1);
}

body {
   background-color: var(--background-1);
}

button {
   width: 80px;
   height: 35px;
   border-radius: 4px;
   background-color: var(--background-3);
   border: 3px solid var(--background-3);
   color: var(--background-1);
   cursor: pointer;
   font-size: 14px;
}

button.alternative {
   background-color: var(--background-1);
   color: var(--background-3);
}

button.alternative:hover {
   background-color: var(--background-3);
   color: var(--background-1);
}

button:hover {
   background-color: var(--background-1);
   color: var(--background-3);
}

.title {
   text-align: center;
   color: var(--foreground-1);
   margin: auto;
   margin-top: 100px;
   max-width: 500px;
}

.title .icon {
   font-family: "Icons", monospace;
   float: left;
}

.version-info {
   color: var(--foreground-1);
   font-size: 12px;
   
   position: fixed;
   margin: 0;
   left: 50%;
   bottom: 10px;
   transform: translateX(-50%);
}

.lobby-setting {
   width: 100%;
}

.center {
   margin: auto;
   max-width: fit-content;
}

</style>
