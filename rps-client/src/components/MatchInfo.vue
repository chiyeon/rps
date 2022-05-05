<template>
   <div class="match-info">
      <div class="background"></div>
      <div class="info">
         <div class="match-type">Best of {{info.targetWins == 2 ? "3" : "5"}}</div>
         <div class="versus">
            <div>{{info.players[0].name}}</div>
            <div>vs</div>
            <div>{{info.players[1].name}}</div>
         </div>
      </div>
      <button @click="Close">OKAY</button>
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

      return {
         Close
      }
   }
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
   .match-info {
      flex-direction: column;
   }
}

.match-info {
   display: flex;
   flex-direction: column;

   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);

   width: 275px;
   height: 100px;

   color: var(--foreground-1);
}

.background {
   background-color: var(--background-1);
   opacity: 0.5;
   z-index: 1;

   position: absolute;

   top: 0%;
   left: 0%;
   transform: translate(-50%, -50%);
   width: 100vw;
   height: 100vh;
}

.match-type {
}

.info {
   z-index: 2;

   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   background-color: var(--background-2);
   border-radius: 10px 10px 0 0;

   height: 100%;
}

.versus {
   display: flex;
   flex-direction: row;
   width: 100%;
   padding-top: 10px;
}

.versus div {
   flex-grow: 1;
   flex: 1;
   text-align: center;
}

.versus div:first-child {
   text-align: right;
   flex: 2;
}

.versus div:last-child {
   text-align: left;
   flex: 2;
}

button {
   z-index: 2;
   border-radius: 0 0 10px 10px;

   border: none;
   background-color: var(--background-3);
   color: var(--foreground-1);

   cursor: pointer;

   height: 32px;
}
</style>