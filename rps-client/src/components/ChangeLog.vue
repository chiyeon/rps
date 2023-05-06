<template>
    <div class="changelog-box">
        <div class="changelog">
            <h3>Version 2.0</h3>
            <p>RPS Tourney 2.0 marks the visual overhaul of the project, and it's new beginnings with the latest version of vue. This project was started and basically finished over a year ago at this point, and despite thinking it'd never recieve another update, version 2.0 brings a plethora of changes.</p>
            <ul>
                <li>Visual Overhaul</li>
                <ul>
                    <li>Fonts changed from monospaced to pixelated</li>
                    <li>Colors changed from monochromatic to brighter</li>
                    <li>Overhaul UI was made cleaner and more stylized</li>
                    <li>Icons/images all updated to match style</li>
                </ul>
                <li></li>
            </ul>
            <h3>Version 1.4</h3>
            <ul>
                <li>Added Loading Screen</li>
                <li>Stabilized server startup times</li>
            </ul>
        </div>
        <button @click="() => emit('back')">back</button>
    </div>
</template>

<script setup>
import { defineEmits } from "vue"

const emit = defineEmits([
    "back"
])
</script>

<style scoped>
.changelog-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: var(--background-1);
}

.changelog {
    max-height: 550px;
    max-width: 450px;
    width: 90%;
    overflow-y: auto;
    margin: auto;
    margin-top: 100px;
}

button {
    margin: auto;
    display: block;
    margin-top: 20px;
}
</style>