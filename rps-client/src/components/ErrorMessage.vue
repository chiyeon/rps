<template>
   <div class="error">
      <div class="error-background"></div>
      <div class="error-message">
         <div>{{errorMessage}}</div>
         <button @click="ResetError()">OK</button>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      errorMessage: String
   },
   emits: [
      "resetError"
   ],
   setup(props, {emit}) {
      function ResetError() {
         emit("resetError");
      }

      return {
         ResetError,
      }
   },
}
</script>

<style scoped>
.error {
   
}

.error-message {
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);

   background-color: var(--background-2);
   color: var(--foreground-1);
   border-radius: 10px;

   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   gap: 10px;

   max-width: 200px;

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
   opacity: 0.3;
}

.error-message div {
   padding: 20px 20px 10px 20px;
   word-wrap: break-word;
}

.error-message button {
   background-color: var(--background-3);
   color: var(--foreground-1);
   border: none;
   border-radius: 0 0 10px 10px;
   width: 100%;
   padding: 5px;

   cursor: pointer;
}
</style>
