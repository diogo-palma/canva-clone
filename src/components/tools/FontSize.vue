<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";

const canvasStore = useCanvasStore();

const handleChangeFontSize = () =>{
  canvasStore.changeFontSize(canvasStore.fontSize)
}
</script>

<template>
  <div class="font-size" v-if="canvasStore.selectedObjectType == 'i-text' || canvasStore.selectedObjectType == 'text'">
    <el-input-number
      v-model="canvasStore.fontSize"
      :min="1"              
      controls-position="right"
      @change="handleChangeFontSize"
    />
  </div>
</template>



<style scoped>
.font-size{
  margin-left: 5px;  
}
.font-size > .ep-input-number{
  width: 80px;
}
</style>