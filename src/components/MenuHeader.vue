<script setup lang="ts">
import { ref, unref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import SolarUndoLeftRoundBroken from '~icons/solar/undo-left-round-broken';
import SolarUndoRightRoundBroken from '~icons/solar/undo-right-round-broken';
import { useCanvasStore } from '~/store/canvasStore';
import MingcuteLayerLine from '~icons/mingcute/layer-line';
import BiTransparency from '~icons/bi/transparency';
import PepiconsPencilDuplicate from '~icons/pepicons-pencil/duplicate';
import BasilTrashOutline from '~icons/basil/trash-outline';
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

import { ClickOutside as vClickOutside } from 'element-plus'


const gradientColor = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");

const buttonRefColor = ref()
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const { t } = useI18n();

const color = ref('#000')
const updateColor = () =>{
  console.log("oi", color.value)
}

const canvasStore = useCanvasStore();

const undo = () => {
  canvasStore.undo();
};

const redo = () => {
  canvasStore.redo();
};

watch(
  () => canvasStore.selectedObjectColor,
  (newVal, oldVal) => {
    color.value = canvasStore.selectedObjectColor
    
  }
);
watch(
  () => color.value,
  (newVal, oldVal) => {
    if (newVal){
      console.log("newvAL", newVal)
      if (newVal == "currentColor")
        canvasStore.changeColor("#000")  
      else
        canvasStore.changeColor(newVal)
    }
  }
)
</script>

<template>
  <el-row>
    <el-col :span="24">
      <div class="menu-header">
        <div class="" >
          <el-button circle :disabled="!canvasStore.canUndo" @click="undo"><SolarUndoLeftRoundBroken /></el-button>
          <el-button circle :disabled="!canvasStore.canRedo" @click="redo"><SolarUndoRightRoundBroken /></el-button>
          
        </div>
        <div class="ml-2" v-if="canvasStore.isThisObjectSelected" >
          <div class="color-block"> 
            <color-picker v-model:pureColor="color" v-model:gradientColor="gradientColor"/>
          </div>
        </div>
        
        <div class="flex-grow" />
        <div>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('menu_header.change_position')"
            placement="bottom"
          >
            <el-button :disabled="!canvasStore.isThisObjectSelected" ref="buttonRef" v-click-outside="onClickOutside">
              <MingcuteLayerLine/>
              <span>{{$t('menu_header.position')}}</span>
            </el-button>
          </el-tooltip>
        
          <el-popover
            ref="popoverRef"
            :virtual-ref="buttonRef"
            trigger="click"            
            virtual-triggering
          >
            <div>
              <span class="title_position">{{$t('menu_header.layering')}}</span>
              <div>

              </div>
            </div>
          </el-popover>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('menu_header.transparency')"
            placement="bottom"
          >
            <el-button style="padding: 0px 10px;" :disabled="!canvasStore.isThisObjectSelected">
              <BiTransparency/>
            </el-button>
          </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="t('menu_header.duplicate')"
          placement="bottom"
        >
          <el-button :disabled="!canvasStore.isThisObjectSelected">
            <PepiconsPencilDuplicate style="font-size: 22px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="t('menu_header.remove')"
          placement="bottom"
        >
          <el-button :disabled="!canvasStore.isThisObjectSelected">
            <BasilTrashOutline/>
          </el-button>
        </el-tooltip>
        </div>
      </div>
      
      
    </el-col>
  </el-row>
</template>

<style scoped>
.menu-header{
  display: flex;
  padding: 0px 20px;
  align-items: center;
  min-height: 7vh;
  box-shadow: var(--el-box-shadow);
}
.menu-select-object{
  display: flex;
  padding: 5px;
}
.ep-button{
  padding: 0px 5px;
}
.title_position{
  font-size: 12px;
  font-weight: 600;
}
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