<template>
   <div class="match-info" @click="() => emit('close')">
      <h3 class="match-type">Best of {{info.targetWins == 2 ? "3" : "5"}}</h3>
      <div class="versus">
         <h1>{{info.players[0].name}}</h1>
         <h1 class="vs">vs</h1>
         <h1>{{info.players[1].name}}</h1>
      </div>
      <h2 class="timer">{{ remaining_time }}</h2>
   </div>
</template>

<script setup>
import { defineEmits, defineProps, onMounted, ref } from "vue"

const remaining_time = ref(3);

defineProps([
   "info"
])

const emit = defineEmits([
   "close"
])

onMounted(() => {
   setInterval(() => {
      remaining_time.value -= 1;

      if (remaining_time.value <= 0) emit("close")
   }, 1000)
})
</script>

<style scoped>
@media only screen and (max-width: 600px) {
   .match-info {
      flex-direction: column;
   }
}

.match-info {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   position: fixed;
   top: 0;
   left: 0;

   width: 100vw;
   height: 100vh;

   color: var(--foreground-1);
   background-color: var(--background-1);
}


h3 {
   font-size: 18px !important;
   margin: 0;
}

.versus {
   display: flex;
   flex-direction: row;
   gap: 10px;
   flex-wrap: wrap;
   justify-content: center;
   width: fit-content;
}

h3,
.versus .vs {
   color: var(--background-2);
   font-size: 48px;
}

.versus > h1 {
   margin: 0;
   font-size: 36px !important;
}

.timer {
   margin-top: 100px;
}
</style>