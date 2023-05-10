<template>
   <div class="match-results" @click="Close()">
      <div class="background"></div>
      <div class="match-info">
         <div class="exit-button">

         </div>
         <div class="player1">
            <div class="winner" v-if="info.winner != undefined">
               <img alt="Crown" src="../assets/imgs/crown.png" />
            </div>
            <div class="choice">
               <img :src="GetImage(info.choices[info.winner])" />
            </div>
         </div>
         <div class="info">
            <p>{{info.targetWins}}</p>
         </div>
      </div>
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
         if (choice)
            return require(`../assets/imgs/${choice}.png`);
         return require("../assets/imgs/tie.png")
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

h1 {
   font-size: 36px !important;
}

.match-results {
   z-index: 1;

   width: 100vw;
   height: 100vh;
}

.background {
   position: fixed;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;

   opacity: 0.5;
   background-color: black;
}

.match-info {
   position: absolute;
   width: 400px;
   height: 300px;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);

   background-color: var(--background-1);
   border: 3px solid var(--background-3);
   border-radius: 4px;

   height: fit-content;
   max-width: 350px;

   padding-top: 15px;

   z-index: 4;

   gap: 10px;

   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   text-align: center;
}

.player1, .player2 {
   height: 100%;
   position: relative;
   top: 20px;
}

img {
   image-rendering: pixelated;
}

.choice img {
   width: 100px;
   position: relative;
}

.winner {
   height: 35px;
}

.winner img {
   width: 71px;
   position: relative;
   bottom: 36px;
}
</style>