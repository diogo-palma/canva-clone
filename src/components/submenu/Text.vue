<script setup lang="ts">
import { useCanvasStore } from '~/store/canvasStore';

const canvasStore = useCanvasStore()
</script>

<template>
  <div class="text-list">
    <div @click="canvasStore.addText('Create title', 22)">
      <span class="create-title">{{$t('canvas.create_title')}}</span>
    </div>
    <div>
      <span class="create-subtitle">{{$t('canvas.create_subtitle')}}</span>
    </div>
    <div>
      <span class="create-text">{{$t('canvas.create_text')}}</span>
    </div>
  </div>
</template>


<style scoped>
.text-list{
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 10px;
}
.create-title{
  font-size: 22px;
  font-weight: 800;
}

.create-subtitle{
  font-size: 18px;
  font-weight: 600;
  margin-top: 8px;
  display: block;
}

.create-text{
  font-size: 14px;
  margin-top: 8px;
  display: block;
}
</style>