<script setup lang="ts">
import { ref } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';

const canvasStore = useCanvasStore()
const textItems = ref([
  {
    title: {
      text: 'Title',
      fontSize: 22,
    }
  },
  {
    subtitle: {
      text: 'Subitle',
      fontSize: 18,
    }
  },
  {
    text: {
      text: 'Text',
      fontSize: 14
    }
  }
])

const addText = (type: string) => {
  const item = textItems.value.find(item => item.hasOwnProperty(type));
  console.log(item[type])
  canvasStore.addText(item[type])
}
</script>

<template>
  <div class="text-list">
    <div @click="addText('title')">
      <span class="create-title">{{$t('canvas.create_title')}}</span>
    </div>
    <div @click="addText('subtitle')">
      <span class="create-subtitle">{{$t('canvas.create_subtitle')}}</span>
    </div>
    <div @click="addText('text')">
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
.text-list > div{
  cursor: pointer;
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