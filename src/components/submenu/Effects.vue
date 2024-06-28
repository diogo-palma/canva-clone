<script setup lang="ts">
import { useSubmenuStore } from '~/store/submenuStore'
import { useCanvasStore } from '~/store/canvasStore'
import { onMounted, reactive, ref, watch, CSSProperties } from 'vue';
import { ColorPicker } from "vue3-colorpicker";


const hasStroke = ref(false)
const hasBackground = ref(false)
const hasShadow = ref(false)
const hasBlur = ref(false)

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const marks = reactive<Marks>({
  0: '0',
  '-100': '-100',
  100: '100'

})

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
    canvasStore.selectedBackgroundCornerRadius = 0
    canvasStore.selectedBackgroundPadding = 0
    canvasStore.changeBackgroundColor()
    canvasStore.changeBackgroundPadding()
  }else{
    canvasStore.selectedTextBackgroundColor = "#ccc";
    if (canvasStore.selectedBackgroundCornerRadius)
      canvasStore.changeBackgroundColor()
    if (canvasStore.selectedBackgroundPadding)
      canvasStore.changeBackgroundPadding()
  }
}

const handleDisableShadow = () => {
  if (!hasShadow.value) {    
    canvasStore.selectedShadowColor = ""
    canvasStore.selectedShadowBlur = 0
    canvasStore.selectedShadowOffSetX = 5
    canvasStore.selectedShadowOffSetY = 5    
    canvasStore.changeShadow()
  }else{    
    canvasStore.selectedShadowColor = "#ccc"    
    canvasStore.changeShadow()
  }
}


onMounted(() => {
  if (canvasStore.selectedTextStroke > 1 || canvasStore.selectedTextStrokeColor != "#000"){
    hasStroke.value = true
  }
  if (canvasStore.selectedTextBackgroundColor || canvasStore.selectedBackgroundCornerRadius > 0 || canvasStore.selectedBackgroundPadding > 0) {
    hasBackground.value = true
  }
  if (canvasStore.selectedShadowColor){
    hasShadow.value = true
  }
});

watch(
  () => canvasStore.isThisObjectSelected,
  (newVal, oldVal) => {
    console.log("canvasStore.isThisObjectSelected", canvasStore.isThisObjectSelected)
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

watch(
  () => canvasStore.selectedBlur,
  () => {
    canvasStore.changeBlur();
  }
);


watch(
  () => [canvasStore.selectedShadowColor, canvasStore.selectedShadowOffSetX, canvasStore.selectedShadowOffSetY, canvasStore.selectedShadowBlur],
  () => {
    canvasStore.changeShadow();
  }
);
</script>

<template>
  <div style="margin: 10px;">
    <span style="font-weight: 600;font-size: 16px;">{{ $t('menu_header.effects') }}</span>
    <div class="mt-5" >
      
      <div class="mt-3" style="display: flex;">
        <div class="mt-1">
          <span>{{ $t('menu_header.text_stroke') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasStroke" @change="handleDisableStroke"   />
        </div>        
      </div>
      <div v-show="hasStroke" style="display:flex" class="tools-open">
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
      <div class="tools-open" v-show="hasBackground">
        <div class="mt-3"  style="display:flex">
          <div class="mt-1">
            {{ $t('menu_header.color') }}
          </div>
          <div class="flex-grow"/>
          <div class="color-picker" >
            <color-picker v-model:pureColor="canvasStore.selectedTextBackgroundColor"  picker-type="chrome"/>
          </div>
        </div>
        <div class="mt-3"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.padding') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedBackgroundPadding" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div  style="width: 300px;">
          <el-slider v-model="canvasStore.selectedBackgroundPadding" />
        </div>
  
        <div class="mt-3"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.corner_radius') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedBackgroundCornerRadius" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div style="width: 300px;">
          <el-slider v-model="canvasStore.selectedBackgroundCornerRadius" />
        </div>
      </div>

      <div style="display: flex;margin-top: 10px;">
        <div class="mt-1">
          <span>{{ $t('menu_header.shadow') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasShadow" @change="handleDisableShadow" />
        </div> 
      </div>
      <div class="tools-open" v-show="hasShadow">
        <div class="mt-3"  style="display:flex">
          <div class="mt-1">
            {{ $t('menu_header.color') }}
          </div>
          <div class="flex-grow"/>
          <div class="color-picker" >
            <color-picker v-model:pureColor="canvasStore.selectedShadowColor"  picker-type="chrome"/>
          </div>
        </div>
        <div class="mt-3"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.offset_x') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedShadowOffSetX" :min="-100" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div style="width: 280px; margin-left: 10px;">
          <el-slider v-model="canvasStore.selectedShadowOffSetX" :min="-100" :max="100" :marks="marks"/>
        </div>
        <div class="mt-5"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.offset_y') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedShadowOffSetY" :min="-100" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div style="width: 280px; margin-left: 10px;">
          <el-slider v-model="canvasStore.selectedShadowOffSetY" :min="-100" :max="100" :marks="marks" />
        </div>
        <div class="mt-5"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.blur') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedShadowBlur" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div style="width: 280px; margin-left: 10px;">
          <el-slider v-model="canvasStore.selectedShadowBlur" :min="0" :max="30"  />
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
  padding: 3px 5px;
  border-radius: 5px;
}
.tools-open{
  background: #1d1d1d;
  padding: 5px 10px;
  font-size: 14px;
}
</style>