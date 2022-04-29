<template>
   <div>
      <div v-if="!gameOver" class="game">
         <div class="game-info">
            <div class="game-info-matches">
               <div>Matches this Set:</div>
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
         
         <div class="game-options" v-if="lobby.matches.length > 0 && userSocket.id == lobby.matches[lobby.currentMatch].players[0].id || userSocket.id == lobby.matches[lobby.currentMatch].players[1].id">
            <button :class="userChoice == 'rock' ? 'game-option selected' : 'game-option'" @click="Select('rock')">🪨</button>
            <button :class="userChoice == 'paper' ? 'game-option selected' : 'game-option'" @click="Select('paper')">📜</button>
            <button :class="userChoice == 'scissor' ? 'game-option selected' : 'game-option'" @click="Select('scissor')">✂️</button>
         </div>
      </div>
      <div v-if="gameOver" class="results">
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
      </div>
   </div>
</template>

<script>
export default {
   props: {
      lobby: Object,
      userSocket: Object,
      userChoice: String,
      gameOver: Boolean
   },
   emits: [
      "select"
   ],
   setup(props, {emit}) {
      function Select(_choice) {
         emit("select", _choice);
      }

      return {
         Select
      }
   }
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
   .game-info {
      grid-template-columns: 1fr !important;
   }

   .game {
      width: 300px !important;
      height: 500px !important;
   }

   .game-option {
      
   }
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
   width: 100%;

   flex: 1;
   display: flex;
   flex-direction: row;

   border-radius: 10px;

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
</style>