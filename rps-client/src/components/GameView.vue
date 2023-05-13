<template>
   <div>
      <div v-if="!gameOver" class="game">
         <div class="versus">
            <h1>{{lobby.matches[lobby.currentMatch].players[0].name}}</h1>
            <h1 class="vs">vs</h1>
            <h1>{{lobby.matches[lobby.currentMatch].players[1].name}}</h1>
         </div>
         <div class="game-options" v-if="lobby.matches.length > 0 && userSocket.id == lobby.matches[lobby.currentMatch].players[0].id || userSocket.id == lobby.matches[lobby.currentMatch].players[1].id">
            <button :class="userChoice == 'rock' ? 'game-option selected' : 'game-option'" @click="Select('rock')"><img src="../assets/imgs/rock.png" /></button>
            <button :class="userChoice == 'paper' ? 'game-option selected' : 'game-option'" @click="Select('paper')"><img src="../assets/imgs/paper.png" /></button>
            <button :class="userChoice == 'scissor' ? 'game-option selected' : 'game-option'" @click="Select('scissor')"><img src="../assets/imgs/scissor.png" /></button>
         </div>
         <div v-else class="game-info">
            <div class="game-info-matches">
               <h2>Up Next</h2>
               <p v-for="i in lobby.matches" :key="i.players[0].id">
                  {{ i.players[0].name + (i.players[0].id == userSocket.id ? " (you)" : "")}} vs {{i.players[1].name + (i.players[1].id == userSocket.id ? " (you)" : "") }}
               </p>
            </div>
            <div class="game-info-log">
               <h2>Game Transcript:</h2>
               <div class="game-info-log-scroll" ref="matchTranscript">
                  <p v-for="message in [...lobby.messages]" :key="message.id">
                     {{message.content}}
                  </p>
               </div>
            </div>
         </div>
      </div>
      <MatchInfo 
         :info="matchInfo" 
         @close="CloseInfo"
         v-if="showMatchInfo" 
      />
      <MatchResults
         :info="matchResults"
         @close="CloseMatchResults"
         v-if="showMatchResults"
      />
      <TourneyResults
         :lobby="lobby"
         v-if="gameOver"
      />
      <!-- <div v-if="gameOver" class="results">
         <div class="results-top">
            <div>Game is Over!</div>
            <br>
            <div>Winner: {{lobby.winners.first.name}}</div>
            <div>Honored: {{lobby.winners.second.name}}</div>
         </div>
         <div class="results-bottom">
            Full Game Transcript:
            <pre class="transcript">{{lobby.transcript}}
            </pre>
         </div>
      </div> -->
   </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, nextTick } from "vue"

import MatchResults from "./MatchResults.vue"
import MatchInfo from "./MatchInfo.vue"
import TourneyResults from "./TourneyResults.vue"

const props = defineProps([
   "lobby",
   "userSocket",
   "userChoice",
   "gameOver",
   "matchInfo",
   "matchResults",
   "tourneyResults"
])

const emit = defineEmits([
   "select"
])

const showMatchResults = ref(false);
const showMatchInfo = ref(false);
const showGame = ref(false)
const matchTranscript = ref()

watch(() => props.matchInfo, () => {
   showMatchInfo.value = true;
})

watch(() => props.matchResults, () => {
   showMatchResults.value = true;
   showMatchInfo.value = false;
   Select(null)
})

watch(() => props.lobby.messages, async () => {
   await nextTick()
   if (matchTranscript.value) matchTranscript.value.scrollTop = matchTranscript.value.scrollHeight;
})

function Select(_choice) {
   emit("select", _choice);
}

function CloseInfo() {
   showMatchInfo.value = false
   showGame.value = true;
}

function CloseMatchResults() {
   showMatchResults.value = false;
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
   .game-info {
      
   }
}

.game {
   display: flex;
   flex-direction: column;
   max-height: 95vh;
   gap: 10px;

   color: var(--foreground-1);
}

.game-info {
   display: flex;
   flex-direction: column;
   min-height: 300px;
   height: 100%;
   max-width: 500px;
   margin: auto;

   border-radius: 4px;

   border: 3px solid var(--background-3);

   padding: 10px;

}

.game-info-log-scroll p {
   margin: 0;
}

.game-info-matches {
   flex: 1;
   overflow-y: auto;
}

.game-info-log {
   flex: 4;
}

.game-info-log-scroll {
   overflow-y: auto;
   max-height: 500px;
}

/* magic number 33 = height of the game transcript h2 */

.game-options {
   max-width: calc(130px * 3);
   height: fit-content;

   margin: auto;
   margin-top: 60px;

   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   align-items: center;

   background-color: var(--background-1);

   image-rendering: pixelated;
}

.game-option {
   background: none;
   border: none;
   padding: 10px;

   cursor: pointer;

   opacity: 0.3;

   transition: opacity 100ms;

   width: 120px;
   height: 120px;
}

.game-option img {
   width: 100%;
}

.game-option:hover {
   opacity: 0.7;
}

.game-option.selected {
   opacity: 1;
}

.results {
   width: 300px;
   height: 400px;

   padding: 10px;
   border-radius: 10px;

   background-color: var(--background-2);
   color: var(--foreground-1);

   display: flex;
   flex-direction: column;
}

.results-top {
   text-align: center;
   flex: 1;
}

.results-bottom {
   flex: 4;
   overflow-y: auto;
}
.results-bottom pre {
   max-width: 100%;
   white-space: pre-wrap;
}

.versus {
   justify-content: center;
   display: flex;
   flex-direction: row;
   gap: 10px;
   flex-wrap: wrap;
   width: fit-content;
   margin: auto;
   margin-top: 100px;
}

.versus .vs {
   color: var(--background-2);
   font-size: 48px;
}

.versus > h1 {
   margin: 0;
   font-size: 36px !important;
}

h2 {
   margin: 0;
}
</style>