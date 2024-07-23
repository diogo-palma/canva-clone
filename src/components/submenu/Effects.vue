<script setup lang="ts">
import { useSubmenuStore } from '~/store/submenuStore'
import { useCanvasStore } from '~/store/canvasStore'
import { onMounted, reactive, ref, watch, CSSProperties } from 'vue';
import { ColorPicker } from "vue3-colorpicker";


const hasStroke = ref(false)
const hasStrokeImage = ref(false)
const hasBackground = ref(false)
const hasShadow = ref(false)
const hasBlur = ref(false)
const hasBrightness = ref(false)
const hasSepia = ref(false)
const hasGrayscale = ref(false)
const hasCornerRadius = ref(false)

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
  if (!hasStroke.value && canvasStore.selectedObjectType != 'image') {
    canvasStore.selectedTextStroke = 0
    canvasStore.selectedTextStrokeColor = ""
    canvasStore.changeTextStroke()
    canvasStore.changeTextStrokeColor()
  }else{
    canvasStore.selectedTextStroke = 1
    canvasStore.selectedTextStrokeColor = "#000"
    canvasStore.changeTextStroke()
    canvasStore.changeTextStrokeColor()
  }
}

const handleDisableStrokeImage = () =>{
  if (!hasStrokeImage.value && canvasStore.selectedObjectType == 'image') {
    canvasStore.selectedTextStroke = 0
    canvasStore.selectedTextStrokeColor = ""
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

const handleDisableBlur = () => {
  if (!hasBlur.value) {    
    canvasStore.selectedBlur = 0    
    canvasStore.changeBlur()
  }else{    
    canvasStore.selectedBlur = 10    
    canvasStore.changeBlur()
  }
}

const handleDisableBrightness = () => {
  if (!hasBrightness.value) {    
    // canvasStore.selectedBrightness = 100    
    canvasStore.removeBrightness()
  }else{    
    canvasStore.selectedBrightness = 100
    canvasStore.changeBrightness()
  }
}


const handleDisableSepia = () => {
  if (!hasSepia.value) {    
    canvasStore.selectedSepia = false 
    canvasStore.changeSepia()
  }else{    
    canvasStore.selectedSepia = true    
    canvasStore.changeSepia()
  }
}

const handleDisableGrayscale = () => {
  if (!hasGrayscale.value) {    
    canvasStore.selectedGrayscale = false 
    canvasStore.changeGrayscale()
  }else{    
    canvasStore.selectedGrayscale = true    
    canvasStore.changeGrayscale()
  }
}

const handleDisableCornerRadius = () => {
  if (!hasCornerRadius.value) {    
    canvasStore.selectedCornerRadius = 0    
    canvasStore.changeCornerRadius()
  }else{    
    canvasStore.selectedCornerRadius = 10    
    canvasStore.changeCornerRadius()
  }
}

const checkValues = () =>{
  if (canvasStore.selectedTextStroke > 1 || canvasStore.selectedTextStrokeColor){
    hasStroke.value = true
    hasStrokeImage.value = true
  }else{
    hasStroke.value = false
    hasStrokeImage.value = false
  }
  if (canvasStore.selectedTextBackgroundColor || canvasStore.selectedBackgroundCornerRadius > 0 || canvasStore.selectedBackgroundPadding > 0) {
    hasBackground.value = true
  }else{
    hasBackground.value = false
  }
  if (canvasStore.selectedShadowColor){
    hasShadow.value = true
  }else{
    hasShadow.value = false
  }
  if (canvasStore.selectedBlur > 0){
    hasBlur.value = true
  }else{
    hasBlur.value = false
  }

  if (canvasStore.selectedBrightness){
    hasBrightness.value = true
  }else{
    hasBrightness.value = false
  }

  if (canvasStore.selectedSepia){
    hasSepia.value = true
  }else{
    hasSepia.value = false
  }

  if (canvasStore.selectedGrayscale){
    hasGrayscale.value = true
  }else{
    hasGrayscale.value = false
  }

  if (canvasStore.selectedCornerRadius){
    hasCornerRadius.value = true
  }else{
    hasCornerRadius.value = false
  }
}

onMounted(() => {
  checkValues()
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
  () => canvasStore.changeSelected,
  (newVal, oldVal) => {
    console.log("canvasStore.changeSelected", canvasStore.changeSelected)
    checkValues()
    
  }
);




watch(
  () => canvasStore.selectedTextStrokeColor,
  (newVal, oldVal) => {   
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
  () => canvasStore.selectedBrightness,
  () => {
    if (canvasStore.selectedBrightness)
      canvasStore.changeBrightness();
  }
);

watch(
  () => canvasStore.selectedCornerRadius,
  () => {
    canvasStore.changeCornerRadius();
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
      
      <div class="mt-3" style="display: flex;"  v-if="canvasStore.selectedObjectType == 'i-text' || canvasStore.selectedObjectType == 'text'">
        <div class="mt-1">
          <span>{{ $t('menu_header.text_stroke') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasStroke" @change="handleDisableStroke"   />
        </div>        
      </div>
      <div v-show="hasStroke && canvasStore.selectedObjectType == 'i-text'" style="display:flex" class="tools-open">
        <div class="color-picker">
          <color-picker v-model:pureColor="canvasStore.selectedTextStrokeColor"  picker-type="chrome"/>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-input-number v-model="canvasStore.selectedTextStroke" :min="1"   controls-position="right" @change="handleChangeTextStroke" />
        </div>
      </div>   
      <div style="display: flex;margin-top: 10px;"  v-if="canvasStore.selectedObjectType == 'i-text' || canvasStore.selectedObjectType == 'text'">
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


      <div style="display: flex;margin-top: 10px;" v-if="canvasStore.selectedObjectType == 'image'">
        <div class="mt-1">
          <span>{{ $t('menu_header.blur') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasBlur" @change="handleDisableBlur" />
        </div> 
      </div>
      <div class="tools-open" v-show="hasBlur">
        <div class="mt-3"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.blur') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedBlur" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div  style="width: 300px;">
          <el-slider v-model="canvasStore.selectedBlur" />
        </div>
      </div>


      <div style="display: flex;margin-top: 10px;" v-if="canvasStore.selectedObjectType == 'image'">
        <div class="mt-1">
          <span>{{ $t('menu_header.brightness') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasBrightness" @change="handleDisableBrightness" />
        </div> 
      </div>
      <div class="tools-open" v-show="hasBrightness">
        <div class="mt-3"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.brightness') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedBrightness" :min="1" :max="200"  controls-position="right"  />
          </div>
        </div>
        <div  style="width: 300px;">
          <el-slider v-model="canvasStore.selectedBrightness" :max="200" />
        </div>
      </div>

       


      <div style="display: flex;margin-top: 10px;" v-if="canvasStore.selectedObjectType == 'image'">
        <div class="mt-1">
          <span>{{ $t('menu_header.sepia') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasSepia" @change="handleDisableSepia" />
        </div> 
      </div>      


      <div style="display: flex;margin-top: 10px;" v-if="canvasStore.selectedObjectType == 'image'">
        <div class="mt-1">
          <span>{{ $t('menu_header.grayscale') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasGrayscale" @change="handleDisableGrayscale" />
        </div> 
      </div>  

      <div class="mt-3" style="display: flex;"  v-if="canvasStore.selectedObjectType == 'image'">
        <div class="mt-1">
          <span>{{ $t('menu_header.border') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasStrokeImage" @change="handleDisableStrokeImage"   />
        </div>        
      </div>
      <div v-show="hasStrokeImage && canvasStore.selectedObjectType == 'image'" style="display:flex" class="tools-open">
        <div class="color-picker">
          <color-picker v-model:pureColor="canvasStore.selectedTextStrokeColor"  picker-type="chrome"/>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-input-number v-model="canvasStore.selectedTextStroke" :min="1"   controls-position="right" @change="handleChangeTextStroke" />
        </div>
      </div>  


      <div style="display: flex;margin-top: 10px;" v-if="canvasStore.selectedObjectType == 'image'">
        <div class="mt-1">
          <span>{{ $t('menu_header.corner_radius') }}</span>
        </div>
        <div class="flex-grow"></div>
        <div>
          <el-switch v-model="hasCornerRadius" @change="handleDisableCornerRadius" />
        </div> 
      </div>
      <div class="tools-open" v-show="hasCornerRadius">
        <div class="mt-3"  style="display:flex">
          <div class="mt-2">
            <span>{{ $t('menu_header.corner_radius') }}</span>
          </div>
          <div class="flex-grow"/>
          <div >
            <el-input-number v-model="canvasStore.selectedCornerRadius" :min="0" :max="100"  controls-position="right"  />
          </div>
        </div>
        <div  style="width: 300px;">
          <el-slider v-model="canvasStore.selectedCornerRadius" />
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