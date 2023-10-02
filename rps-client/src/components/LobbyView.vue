<template>
   <div class="lobby">
      <h1 class="lobby-title"><span>lobby:</span><br />{{lobby.name}}</h1>
      <div class="lobby-players">
         <div :class="selfID == player.id ? 'player highlight' : 'player'" v-for="player in lobby.players" :key="player.id">
            <p class="sprite" @click="() => selfID == player.id ? emit('new-sprite') : ''">{{ player.sprite }}</p>
            <p class="name">{{ player.name }} {{selfID == player.id ? "(you)" : ""}}</p>
            <img :class="lobby.host_player.name == player.name ? 'host-icon' : 'host-icon hidden'" alt="Host" src="../assets/imgs/crown.png" />
         </div>
      </div>
      <div class="buttons">
         <button class="alternative" @click="() => emit('exit')">quit</button>
         <button :disabled="selfID != lobby.host_player.id" class="lobby-start" @click="() => emit('begin')">begin</button>
      </div>
   </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

defineProps([
   "lobby", "isHost", "selfID", "sprites"
])

const emit = defineEmits([
   "begin",
   "exit",
   "new-sprite"
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

   max-height: 300px;
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
   margin-left: auto;
}

.player .host-icon.hidden {
   opacity: 0;
}

.sprite {
   font-family: "Icons";
   font-size: 32px;
   cursor: pointer;
   user-select: none;
}
</style>

