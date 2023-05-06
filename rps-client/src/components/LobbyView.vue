<template>
   <div class="lobby">
      <h1 class="lobby-title"><span>lobby:</span><br />{{lobby.name}}</h1>
      <div class="lobby-players">
         <div :class="selfID == player.id ? 'player highlight' : 'player'" v-for="player in lobby.players" :key="player.id">
            <img :class="lobby.host.id == player.id ? 'host-icon' : 'host-icon hidden'" alt="Host" src="../assets/imgs/crown.png" />
            <p class="name">{{ player.name }} {{selfID == player.id ? "(you)" : ""}}</p>
         </div>
      </div>
      <div class="buttons">
         <button class="alternative" @click="() => emit('exit')">menu</button>
         <button :disabled="selfID != lobby.host.id" class="lobby-start" @click="() => emit('begin')">begin</button>
      </div>
   </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

defineProps([
   "lobby", "isHost", "selfID"
])

const emit = defineEmits([
   "begin",
   "exit"
])
</script>

<style scoped>
.lobby {
   margin-top: 100px;
}

.lobby-title {
   color: var(--foreground-1);
   text-align: center;
}

.lobby-title span {
   color: var(--background-2);
}

.lobby-players {
   max-width: 300px;
   margin: auto;

   max-height: 500px;
   overflow-y: auto;
}

.buttons {
   margin: auto;
   width: fit-content;
   margin-top: 20px;
}

.buttons button:first-child {
   margin-right: 10px;
}

button:disabled {
   opacity: 0.5;
   cursor: not-allowed;
}

.player {
   display: flex;
   flex-direction: row;
   align-items: center;
   padding: 8px;
   gap: 6px;
   background-color: var(--background-1);
   border: 3px solid var(--background-2);
   border-radius: 4px;
   margin-bottom: 5px;
}

.player.highlight {
   border: 3px solid var(--background-3);
}

.player > * {
   margin: 0;
}

.player .host-icon {
   width: 24px;
   height: 24px;
   image-rendering: pixelated;
}

.player .host-icon.hidden {
   opacity: 0;
}
</style>

