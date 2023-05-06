<template>
   <div class="error">
      <div class="error-background" @click="ResetError()"></div>
      <div class="error-message">
         <p>{{errorMessage}}</p>
         <button @click="ResetError()">OK</button>
      </div>
   </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

defineProps([
   "errorMessage"
])

const emit = defineEmits([
   "resetError"
])

const ResetError = () => {
   emit("resetError")
}
</script>

<style scoped>
.error {
   
}

p {
   margin-top: 0;
}

.error-message {
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
   padding: 20px;

   background-color: var(--background-1);
   color: var(--foreground-1);
   border-radius: 4px;
   border: 3px solid var(--background-3);

   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   gap: 10px;

   max-width: 300px;

   z-index: 2;
}

.error-background {
   z-index: 1;
   position: absolute;
   top: 0%;
   left: 0%;

   width: 100vw;
   height: 100vh;
   max-width: 100%;
   max-height: 100%;

   background-color: black;
   opacity: 0.35;
}

.error-message div {
   padding: 20px 20px 10px 20px;
   word-wrap: break-word;
}

</style>
