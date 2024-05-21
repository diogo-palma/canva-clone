<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { CSSProperties } from 'vue'
import TdesignZoomIn from '~icons/tdesign/zoom-in';
import TdesignZoomOut from '~icons/tdesign/zoom-out';
import { useCanvasStore } from '../store/canvasStore'

const canvasStore = useCanvasStore();
const value = ref(100)

const handleZoomIn = () => {
  if (canvasStore.zoomLevel < 300) {
    canvasStore.zoomLevel += 10
  }
}

const handleZoomOut = () => {
  if (canvasStore.zoomLevel > 0) {
    canvasStore.zoomLevel -= 10
  }
}
</script>
<template>
  <div class="menu-footer">
    <div class="flex-grow" />
    <div >
      <div class="slider-demo-block">
        <TdesignZoomOut class="zoom" @click="handleZoomOut" />
        <el-slider v-model="canvasStore.zoomLevel" :show-tooltip="false" max="300"  />
        <TdesignZoomIn class="zoom" @click="handleZoomIn" />
      </div>
      <div class="zoom-value">
        <div class="zoom-text">
          <span>{{canvasStore.zoomLevel}} % </span>
        </div>        
      </div>
      
    </div>
    
    
  </div>
</template>

<style scoped>
.menu-footer{
  display: flex;
  padding: 12px 20px;
  align-items: center;
  min-height: 3vh;
  box-shadow: var(--el-box-shadow);
}
.zoom{
  cursor: pointer;
  font-size: 26px;
  margin: 0px 10px;
}
.zoom-value{
  position: relative;
}
.zoom-text{
  position: absolute;
  left: 45%;
  top: -10px;
  font-size: 12px;
}

.slider-demo-block {
  width: 200px;
  display: flex;
  align-items: center;
  margin-top: -10px;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;  
}
:deep(.ep-slider__stop){
  background-color: #6f6f6f;
}
:deep(.ep-slider__marks-text){
  font-size: 10px 
}
:deep(.ep-slider__bar){
  background: #613fe6;
}
:deep(.ep-slider__button){
  width: 15px;
  height: 15px;
  border: solid 2px #613fe6;
}

</style>