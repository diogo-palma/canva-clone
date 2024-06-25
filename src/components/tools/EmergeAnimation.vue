<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useSubmenuStore } from '../../store/submenuStore'
import { useI18n } from 'vue-i18n';
import { ClickOutside as vClickOutside } from 'element-plus'
import MaterialSymbolsLightGradient from '~icons/material-symbols-light/gradient';
import { ref, unref } from "vue";

const { t } = useI18n();
const canvasStore = useCanvasStore();
const animationIn = ref(true)

const popoverRef = ref()
const buttonRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

let animationTimeout = null;

const animateEmerge = () => {
  clearTimeout(animationTimeout); 
  animationTimeout = setTimeout(() => {
    canvasStore.animateEmerge(animationIn.value);
  }, 500); 
}

</script>
<template>
  <div>
    
    <el-button class="animation-button" @click="canvasStore.animateElevation" :disabled="!canvasStore.isThisObjectSelected" ref="buttonRef" v-click-outside="onClickOutside">
      <div class="button-content">
        <MaterialSymbolsLightGradient class="button-icon" />
        <span class="button-text">{{ $t('menu_header.emerge') }}</span>
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
            <el-input-number v-model="canvasStore.selectedAnimationDuration" :min="0.01" :max="60"  controls-position="right" :precision="2" :step="0.1" @change="animateEmerge"/>
          </div>
        </div>
        <div style="width: 270px;margin-left: 5px">
          <el-slider :show-tooltip="false" v-model="canvasStore.selectedAnimationDuration" :min="0.30" :max="60" @change="animateEmerge" />
        </div>
        <div style="display:flex;justify-content: center;">
          <el-switch v-model="animationIn"  :active-text="t('menu_header.in')" :inactive-text="t('menu_header.out')" @change="animateEmerge" />
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