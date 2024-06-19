<script setup lang="ts">
import { useSubmenuStore } from '~/store/submenuStore'
import { useCanvasStore } from '~/store/canvasStore'
import { onMounted, ref, watch } from 'vue';
import { ColorPicker } from "vue3-colorpicker";


const hasStroke = ref(false)
const hasBackground = ref(false)

const canvasStore = useCanvasStore();
const submenuStore = useSubmenuStore();


const handleChangeTextStroke = () =>{
  canvasStore.changeTextStroke()
}

const handleDisableStroke = () =>{
  if (!hasStroke.value) {
    canvasStore.selectedTextStroke = 0
    canvasStore.selectedTextStrokeColor = "#000"
    canvasStore.changeTextStroke()
    canvasStore.changeTextStrokeColor()
  }else{
    canvasStore.selectedTextStroke = 1
    canvasStore.selectedTextStrokeColor = "#000"
    canvasStore.changeTextStroke()
    canvasStore.changeTextStrokeColor()
  }
}

const handleDisableBackground = () =>{
  if (!hasBackground.value) {    
    canvasStore.selectedTextBackgroundColor = ""
    canvasStore.changeBackgroundColor()
  }else{
    canvasStore.selectedTextBackgroundColor = "#fff"    
    canvasStore.changeBackgroundColor()
  }
}


onMounted(() => {
  if (canvasStore.selectedTextStroke > 1 || canvasStore.selectedTextStrokeColor != "#000"){
    hasStroke.value = true
  }
  if (canvasStore.selectedTextBackgroundColor) {
    hasBackground.value = true
  }
});

watch(
  () => canvasStore.isThisObjectSelected,
  (newVal, oldVal) => {
    if (!newVal){
      if (submenuStore.lastActive){
        submenuStore.openSubmenu(submenuStore.lastActive, submenuStore.lastComponent)
      }else{
        submenuStore.closeSubmenu()
      }
    }
  }
);

watch(
  () => canvasStore.selectedTextStrokeColor,
  () => {
    canvasStore.changeTextStrokeColor();
  }
);

watch(
  () => canvasStore.selectedBackgroundPadding,
  () => {
    canvasStore.changeBackgroundPadding();
  }
);

watch(
  () => canvasStore.selectedTextBackgroundColor,
  () => {
    canvasStore.changeBackgroundColor();
  }
);

watch(
  () => canvasStore.selectedBackgroundCornerRadius,
  () => {
    canvasStore.changeBackgroundCornerRadius();
  }
);
</script>

<template>
  <div style="margin: 10px;">
    <span style="font-weight: 600;font-size: 16px;">{{ $t('menu_header.effects') }}</span>
    <div class="mt-5" >
      <div style="display: flex;">
        <div style="margin-top: 5px;">
          <span>{{ $t('menu_header.text_stroke') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasStroke" @change="handleDisableStroke" />
        </div>        
      </div>
      <div v-show="hasStroke" style="display:flex">
        <div class="color-picker">
          <color-picker v-model:pureColor="canvasStore.selectedTextStrokeColor"  picker-type="chrome"/>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-input-number v-model="canvasStore.selectedTextStroke" :min="1"   controls-position="right" @change="handleChangeTextStroke" />
        </div>
      </div>   
      <div style="display: flex;margin-top: 10px;">
        <div class="mt-1">
          <span>{{ $t('menu_header.background') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasBackground" @change="handleDisableBackground" />
        </div> 
      </div>  
      <div>
        <div class="mt-3" v-show="hasBackground" style="display:flex">
          <div class="mt-2">
            {{ $t('menu_header.color') }}
          </div>
          <div class="flex-grow"/>
          <div class="color-picker" style="padding: 1px 4px;">
            <color-picker v-model:pureColor="canvasStore.selectedTextBackgroundColor"  picker-type="chrome"/>
          </div>
        </div>
        <div class="mt-3" v-show="hasBackground" style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.padding') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedBackgroundPadding" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div v-show="hasBackground" style="width: 335px;">
          <el-slider v-model="canvasStore.selectedBackgroundPadding" />
        </div>
  
        <div class="mt-3" v-show="hasBackground" style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.corner_radius') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedBackgroundCornerRadius" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div v-show="hasBackground" style="width: 335px;">
          <el-slider v-model="canvasStore.selectedBackgroundCornerRadius" />
        </div>
      </div>
      
      
    </div>
  </div>
</template>


<style scoped>
.ep-switch {
  --ep-switch-on-color: #13ce66;
  --ep-switch-off-color: #ff4949 !important;
}
:deep(.vc-color-wrap){
  width: 25px !important;
  margin-right: 0px;
  border: 1px solid #ccc;
}
.color-picker{
  background: #fff;
  width: 25px;
  padding: 2px;
  border-radius: 5px;
}
</style>