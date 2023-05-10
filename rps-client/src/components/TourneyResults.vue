<template>
   <div class="tourney-results">
      <div class="platform">
         <div class="winners">
            <div class="winner"><img class="crown" src="../assets/imgs/crown.png" /><p>{{lobby.winners.first.name}}</p></div>
            <p class="honored">{{lobby.winners.second.name}}</p>
         </div>
         <img class="platform-img" src="../assets/imgs/platform.png" />
      </div>
   </div>
</template>

<script>
export default {
    props: {
        lobby: Object
    },
    setup() {
    },
}
</script>

<style scoped>
.tourney-results {
   position: absolute;
   transform: translate(-50%, -50%);
   top: 50%;
   left: 50%;

   padding: 10px;
   border-radius: 10px;
   background-color: var(--background-1);
}

.platform {
   display: flex;
   justify-content: center;
   align-items: center;
}

.platform-img {
   width: 425px;
}

.winners {
   color: var(--foreground-1);
   display: grid;
   position: absolute;
}

.crown {
   width: 54px;
}

img {
   image-rendering: pixelated;
}

.winner {
   
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   
   position: absolute;
   transform: translate(-99px, -145px);
}

.winner > p {
   margin: 0;
   width: 150px;
   word-wrap: break-word;
}

.honored {
   position: absolute;
   transform: translate(73px, -25px);
}
</style>