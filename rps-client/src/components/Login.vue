<template>
   <form class="login" @submit.prevent="(e) => {e.preventDefault();}">
      <input ref="nameInput" type="text" placeholder="Name"/>
      <input ref="lobbyInput" type="text" placeholder="Lobby"/>
      <input @click="Connect()" type="submit" value="join"/>
   </form>
</template>

<script>
import {ref} from "vue";

export default {

   props: {

   },
   emits: [
      "connect"
   ],
   setup(props, {emit}) {
      const nameInput = ref(null);
      const lobbyInput = ref(null);

      function Connect() {
         emit("connect", nameInput.value.value, lobbyInput.value.value);
      }

      return {
         nameInput,
         lobbyInput,
         Connect
      }
   },
}
</script>

<style scoped>
.login {
   display: flex;
   flex-direction: column;

   width: 225px;
}

.login input {
   padding: 3px 10px 3px 10px;
   height: 30px;

   border: none;
}

.login input:last-child {
   border-radius: 0px 0px 10px 10px;
   cursor: pointer;
}

.login input:first-child {
   border-radius: 10px 10px 0 0;
}
</style>

