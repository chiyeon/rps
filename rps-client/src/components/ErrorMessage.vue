<template>
   <div class="error-message">
      <div>{{errorMessage}}</div>
      <button @click="ResetError()">OK</button>
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
.error-message {
   position: absolute;
   background-color: gray;
   color: white;
   padding: 10px;
   border-radius: 10px;

   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   gap: 10px;

   left: 50%;
   top: 50%;
   transform: translate(-50%, -50%);
}
</style>
