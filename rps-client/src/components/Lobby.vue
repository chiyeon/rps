<template>
   <div class="lobby">
      <div class="lobby-title">In lobby: {{lobby.name}}</div>
      <div class="lobby-players">
         <div>Players Connected:</div>
         <div v-for="player in lobby.players" :key="player.id">
            {{player.name}}
            {{lobby.host.id == player.id ? "(host)" : ""}}
            {{selfID == player.id ? "(you)" : ""}}
         </div>
      </div>
      <button :disabled="selfID != lobby.host.id" class="lobby-start" @click="Begin()">begin</button>
   </div>
</template>

<script>
export default {
   props: {
      lobby: Object,
      isHost: Boolean,
      selfID: String
   },
   emits: [
      "begin"
   ],
   setup(props, {emit}) {
      function Begin() {
         emit("begin");
      }

      return {
         Begin,
      }
   },
}
</script>

<style scoped>
.lobby {
   width: 200px;
   height: 250px;
   border-radius: 10px;

   color: white;
   background-color: rgb(67, 67, 67);

   display: flex;
   flex-direction: column;
   justify-content: center;
}

.lobby-title {
   flex: 0.5;
   padding: 10px 10px 0 10px;
}

.lobby-players {
   flex: 3;
   padding: 0 10px 0 10px;
}

.lobby-start {
   flex: 0.5;
   border-radius: 0 0 10px 10px;
   cursor: pointer;
   border: none;
}
</style>

