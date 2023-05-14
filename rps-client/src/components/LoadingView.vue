<template>
    <div class="loading-screen">
        <h1>Loading</h1>
        <p class="hint">May take a moment for servers to start</p>
        <h1 class="icon">{{ icon_text }}</h1>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue"

const props = defineProps([
    "sprites"
])

const icon_text = ref("")

const new_icon = () => {
    icon_text.value = props.sprites[Math.floor(Math.random() * (props.sprites.length - 1))]
}

onMounted(() => {
    new_icon()

    setInterval(new_icon, 1000)
})
</script>

<style scoped>
h1, p {
    margin: 0;
    text-align: center;
}

p {
    font-size: 14px;
    max-width: 200px;
}

.loading-screen {
   position: fixed;
   left: 0;
   top: 0;
   z-index: 10;
   width: 100vw;
   height: 100vh;

   background-color: var(--background-1);

   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;

   color: var(--foreground-1);
}

.loading-screen .hint {
   font-style: italic;
}

.icon {
    margin-top: 100px;
    font-family: "Icons", monospace;
}
</style>