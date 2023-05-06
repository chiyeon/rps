<template>
   <form class="login" @submit.prevent="(e) => {e.preventDefault();}">
      <div class="text-box">
         <input ref="nameInput" type="text" placeholder=""/>
         <p>Name</p>
      </div>
      <div class="text-box">
         <input ref="lobbyInput" type="text" placeholder=""/>
         <p>Lobby</p>
      </div>
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
   gap: 10px;

   width: 225px;
}

.login input {

   padding: 3px 10px 3px 10px;
   height: 30px;

   background-color: var(--background-1);
   color: var(--foreground-1);

   border: 2px solid var(--background-3);
   border-radius: 4px;
}

input:focus {
   outline: none;
   border: 2px solid var(--foreground-1);
}

input:focus + p {
   color: var(--foreground-1);
}

.text-box p {
   color: var(--background-3);
   background-color: var(--background-1);
   position: relative;
   left: 15px;
   bottom: 50px;
   width: fit-content;
   padding: 0 4px;
}

/* .login input:last-child {
   border-radius: 0px 0px 10px 10px;
   cursor: pointer;

   background-color: var(--background-3);
   color: var(--foreground-1);
}

.login input:first-child {
   border-radius: 10px 10px 0 0;
} */
</style>

