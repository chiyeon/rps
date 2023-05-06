<template>
   <div class="match-results" @click="Close()">
      <div class="match-info">
         <div class="player1">
            <div class="winner">
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

h1 {
   font-size: 36px !important;
}

.match-results {
   z-index: 1;

   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   position: absolute;
   width: 100vw;
   height: 100vh;
   top: 0;
   left: 0;

   background-color: var(--background-1);
}

.match-info {
   height: fit-content;

   z-index: 4;

   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   text-align: center;

   gap: 20px;
}

.player1, .player2 {
   height: 100%;
}

img {
   image-rendering: pixelated;
}

.choice img {
   width: 100px;
}

.winner {
   height: 35px;
}

.winner img {
   width: 50px;
   position: relative;
   right: 10px;
   bottom: 10px;
}
</style>