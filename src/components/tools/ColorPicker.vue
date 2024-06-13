<script setup lang="ts">
import { ref } from "vue";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { useCanvasStore } from "~/store/canvasStore";

const canvasStore = useCanvasStore();
const gradientColor = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");

</script>

<template>
  <div class="color-block"> 
    <color-picker v-model:pureColor="canvasStore.selectedObjectColor" v-model:gradientColor="gradientColor"/>
  </div>
</template>

<style scoped>
.color-block{
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
:deep(.vc-color-wrap){
  width: 25px;
  margin-right: 0px;
}
</style>