<script setup lang="ts">
import { ref, watch } from "vue";
import { ColorPicker } from "vue3-colorpicker";
import FluentColor24Regular from '~icons/fluent/color-24-regular';
import { useCanvasStore } from '~/store/canvasStore'

const backgroundColor  = ref('rgba(0, 0, 0, 0)')
const canvasStore = useCanvasStore();
const strokeColor = ref('#000');

function getLuminance(color: string) {
  const rgbValues = color.match(/\d+/g);
  const r = parseInt(rgbValues[0], 10);
  const g = parseInt(rgbValues[1], 10);
  const b = parseInt(rgbValues[2], 10);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance;
}

function changeBackgroundColor(color: string){
  backgroundColor.value = color
}

watch(backgroundColor, (newColor) => {
  console.log("backgroundColor", newColor)
  const luminance = getLuminance(newColor);
  console.log("luminance", luminance)  
  strokeColor.value = luminance > 128 ? '#000' : '#fff'; 
  if (luminance == 0){
    strokeColor.value = "#000"
  }
  canvasStore.changeCanvasBackgroundColor(newColor)
});
</script>

<template>
  <div>
    <div class="p-3" style="display:flex">
      <div class="color-picker-container">
        <color-picker v-model:pureColor="backgroundColor" />
        <el-icon class="color-picker-icon"><FluentColor24Regular :style="{ '--stroke-color': strokeColor }" /></el-icon>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgb(255,255,255)')" class="color-container color-white"></div>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgb(82, 113, 255)')" class="color-container color-blue"></div>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgb(255, 145, 77)')" class="color-container color-orange"></div>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgb(255, 222, 89)')" class="color-container color-yellow"></div>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgb(255, 63, 63)')" class="color-container color-red"></div>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgb(137, 56, 218)')" class="color-container color-purple"></div>
      </div>
      <div>
        <div @click="changeBackgroundColor('rgba(0, 0, 0, 0)')" class="color-container color-transparent"></div>
      </div>
    </div>
    <Photos/>
    
  </div>
</template>



<style scoped>
.color-picker{
  background: #fff;
  width: 40px;
  border-radius: 5px;
}
.color-container{
  width: 30px !important;
  height: 30px !important;
  border: 1px solid #ccc;
  border-radius: 5px;  
  margin-right: 8px;
  cursor: pointer;
}
.color-white{
  background: rgb(255,255,255);
}
.color-blue{
  background: rgb(82, 113, 255);
}
.color-orange{
  background: rgb(255, 145, 77);
}
.color-yellow{
  background: rgb(255, 222, 89);
}
.color-red{
  background: rgb(255, 63, 63);
}
.color-purple{
  background: rgb(137, 56, 218);
}
.color-transparent{
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 8 8'%3E%3Cg fill='rgba(112, 112, 116, 1)' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E");
  background-color: white;
}
:deep(.vc-color-wrap){
  width: 30px !important;
  height: 30px !important;  
  border: 1px solid #ccc;
  border-radius: 5px;
}

.color-picker-container {
  position: relative;
  display: inline-block;
}

.color-picker-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-69%, -50%);
  pointer-events: none; 
  font-size: 24px;
  
}
.color-picker-icon > svg{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none; /* Permite clicar no color picker através do ícone */
  font-size: 24px;
  color: var(--stroke-color); /* Usar a variável CSS para a cor do contorno */
  -webkit-text-stroke: 1px var(--stroke-color); /* Adicionar contorno ao texto */
}
</style>