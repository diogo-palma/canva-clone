<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useSubmenuStore } from '../../store/submenuStore'
import { useI18n } from 'vue-i18n';
import { ClickOutside as vClickOutside } from 'element-plus'
import FluentPaddingLeft20Filled from '~icons/fluent/padding-left-20-filled';
import { ref, unref } from "vue";

const { t } = useI18n();
const canvasStore = useCanvasStore();

const popoverRef = ref()
const buttonRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

let animationTimeout = null;

const animateLandscape = () => {
  clearTimeout(animationTimeout); 
  animationTimeout = setTimeout(() => {
    canvasStore.animateLandscape();
  }, 500); 
}
</script>

<template>
  <div>
    
    <el-button class="animation-button" @click="canvasStore.animateLandscape" :disabled="!canvasStore.isThisObjectSelected" ref="buttonRef" v-click-outside="onClickOutside">
      <div class="button-content">
        <FluentPaddingLeft20Filled class="button-icon" />
        <span class="button-text">{{ $t('menu_header.landscape') }}</span>
      </div>
      
    </el-button>
    

    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRef"
      placement="bottom-end"
      trigger="click"            
      virtual-triggering
      :width="300"
    >
      <div  class="edit-animation" >
        <div class=""  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.duration_in_sec') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedAnimationDuration" :min="0.01" :max="60"  controls-position="right" :precision="2" :step="0.1" @change="animateLandscape"/>
          </div>
        </div>
        <div style="width: 270px;margin-left: 5px">
          <el-slider :show-tooltip="false" v-model="canvasStore.selectedAnimationDuration" :min="0.30" :max="60" @change="animateLandscape" />
        </div>
        <div style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.initial_position') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number  v-model="canvasStore.selectdElevationAnimationInitialLeft" :min="canvasStore.pageWidth *  (canvasStore.zoomLevel/100) * -1" :precision="2" :max="canvasStore.pageWidth * (canvasStore.zoomLevel/100) + 500"  controls-position="right"  @change="animateLandscape"/>
          </div>
        </div>
        <div style="width: 270px;margin-left: 5px">
          <el-slider :show-tooltip="false" v-model="canvasStore.selectdElevationAnimationInitialLeft" :min="canvasStore.pageWidth *  (canvasStore.zoomLevel/100) * -1" :max="canvasStore.pageWidth * (canvasStore.zoomLevel/100) + 500" @change="animateLandscape" />
        </div>
        <div style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.final_position') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectdElevationAnimationFinalLeft" :min="0" :precision="2" :max="canvasStore.pageWidth * (canvasStore.zoomLevel/100)"  controls-position="right"  @change="animateLandscape"/>
          </div>
        </div>
        <div style="width: 270px;margin-left: 5px">
          <el-slider :show-tooltip="false" v-model="canvasStore.selectdElevationAnimationFinalLeft" :min="0" :max="canvasStore.pageWidth *  (canvasStore.zoomLevel/100)" @change="animateLandscape" />
        </div>
      </div>
    </el-popover>
  </div>
</template>



<style scoped>
.animation-button{
  width: 80px;
  padding: 20px;
}

.animation-button .button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  
}


.animation-button .button-text {
  font-size: 12px; 
  
} 
</style>