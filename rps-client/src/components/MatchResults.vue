<template>
   <div class="match-results">
      <div class="background"></div>
      <div class="match-info">
         <div class="player1">
            <div class="winner">
               <img v-if="info.winner == 0" src="../assets/imgs/crown.png" />
            </div>
            <div class="choice">
               <img :src="GetImage(info.choices[0])" />
            </div>
            <div>
               {{info.players[0].name}}
            </div>
         </div>
         <div class="info">
            <pre>{{info.targetWins}}</pre>
         </div>
         <div class="player2">
            <div class="winner">
               <img v-if="info.winner == 1" src="../assets/imgs/crown.png" />
            </div>
            <div class="choice">
               <img :src="GetImage(info.choices[1])" />
            </div>
            <div>
               {{info.players[1].name}}
            </div>
         </div>
      </div>
      <button @click="Close()">OKAY</button>
   </div>
</template>

<script>
export default {
   props: {
      info: Object
   },
   setup(props, {emit}) {
      function Close() {
         emit("close");
      }

      function GetImage(choice) {
         return require(`../assets/imgs/${choice}.png`);
      }

      return {
         Close,
         GetImage
      }
   }
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
   .match-results {
      width: 275px !important;
   }
}

.match-results {
   z-index: 1;

   display: flex;
   flex-direction: column;

   width: 400px;
   height: 200px;

   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
}

.background {
   z-index: 3;

   position: absolute;
   width: 100vw;
   height: 100vh;

   transform: translate(-50%, -50%);
   left: 50%;
   top: 50%;

   background-color: var(--background-1);
   opacity: 0.5;
}

.match-info {
   z-index: 4;

   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;

   background-color: var(--background-2);
   border-radius: 10px 10px 0 0;

   flex: 3;
   
   width: 100%;

   text-align: center;

   color: var(--foreground-1);
}

.player1, .player2 {
   height: 100%;
}

button {
   z-index: 4;

   border-radius: 0 0 10px 10px;
   border: none;
   background-color: var(--background-3);
   color: var(--foreground-1);

   height: 32px;

   cursor: pointer;
}

.choice img {
   width: 100px;
}

.winner {
   height: 35px;
}

.winner img {
   width: 50px;
}

.match-results div {
   flex: 1;
}
</style>