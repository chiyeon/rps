<template>
   <div class="tourney-results">
      <div class="platform">
         <div class="winners">
            <div class="winner"><img class="crown" src="../assets/imgs/crown.png" /><div>{{lobby.winners.first.name}}</div></div>
            <div class="honored">{{lobby.winners.second.name}}</div>
         </div>
         <img class="platform-img" src="../assets/imgs/crown.png" />
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
   position: absolute;
   text-align: center;

   display: grid;
   grid-template-columns: 1fr 1fr;

   width: 300px;
}

.crown {
   width: 54px;
   position: absolute;
   transform: translate(-50%, -85%);
}

.winner {
   transform: translateY(-65px);
}

.honored {
   transform: translateY(40px);
}
</style>