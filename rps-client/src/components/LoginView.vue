<template>
   <div>
      <div class="title">
         <h1>RPS TOURNEY</h1>
      </div>
      <div class="login">
         <div class="text-box">
            <input ref="nameInput" type="text" placeholder=""/>
            <p>Name</p>
         </div>
         <div class="text-box">
            <input ref="lobbyInput" type="text" placeholder=""/>
            <p>Lobby</p>
         </div>
         <button @click="Connect()" type="submit">Join</button>
      </div>

      <!-- <div class="icons">
         <img src="../assets/imgs/rock.png" />
         <img src="../assets/imgs/paper.png" />
         <img src="../assets/imgs/scissor.png" />
      </div> -->
   </div>
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
   max-width: 200px;
   margin: auto;
}

.login > * {
   margin-bottom: 20px;
}

.login input {

   padding: 3px 10px 3px 10px;
   height: 30px;
   width: calc(100% - 26px);

   background-color: var(--background-1);
   color: var(--foreground-1);

   border: 3px solid var(--background-3);
   border-radius: 4px;

}

input:focus {
   outline: none;
   border-color: var(--foreground-1);
}

input:focus + p {
   color: var(--foreground-1);
}

.text-box {
   width: 100%;
   height: fit-content;
   position: relative;
}

.text-box p {
   color: var(--background-3);
   background-color: var(--background-1);
   position: absolute;
   left: 20px;
   bottom: 21px;
   width: fit-content;
   padding: 0 4px;
   font-size: 12px;
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

button {
   margin: auto;
   display: block;
}

.icons {
   image-rendering: pixelated;
   margin: auto;
   width: fit-content;
}

.icons > img {
   width: 35px;
   height: 35px;
   margin-right: 10px;
}

.icons > img:first-child,
.icons > img:last-child {
   position: relative;
   top: 20px;
}
</style>

