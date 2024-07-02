<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { CSSProperties } from 'vue'
import TdesignZoomIn from '~icons/tdesign/zoom-in';
import TdesignZoomOut from '~icons/tdesign/zoom-out';
import { useCanvasStore } from '../store/canvasStore'

const canvasStore = useCanvasStore();
const maxValue = ref(300)
const minValue = ref(10)

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
        <el-slider v-model="canvasStore.zoomLevel" @input="canvasStore.setZoom" :show-tooltip="false" :min="minValue" :max="maxValue"  />
      </div>
      <div class="zoom-value">
          <el-input-number v-model="canvasStore.zoomLevel" @change="canvasStore.setZoom" size="small" :min="minValue" :max="maxValue" :value-on-clear="minValue">
            <template #decrease-icon>
              <el-icon>
                <TdesignZoomOut />
              </el-icon>
            </template>
            <template #increase-icon>
              <el-icon>
                <TdesignZoomIn />
              </el-icon>
            </template>
          </el-input-number>   
      </div>
      
    </div>
    
    
  </div>
</template>

<style scoped>
.menu-footer{
  display: flex;
  padding: 0px 20px;
  align-items: center;
  min-height: 7.7vh;
  box-shadow: var(--el-box-shadow);
}
.zoom-value{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -5px;
}
.zoom{
  cursor: pointer;
}


.slider-demo-block {
  width: 200px;
  display: flex;
  align-items: center;
  margin-top: -15px;
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