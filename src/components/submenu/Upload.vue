<script setup lang="ts">

import { onUnmounted, ref } from "vue";
import { Plus, Delete } from '@element-plus/icons-vue'
import SolarAddSquareBold from '~icons/solar/add-square-bold';
import { useCanvasStore } from '~/store/canvasStore'
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';


const { t } = useI18n();


const canvasStore = useCanvasStore();


const importAll = (context) => Object.keys(context).map(key => ({ key, module: context[key]() }));

const imageModules = importAll(import.meta.glob('/src/assets/templates/*.{png,jpg,jpeg,svg}'));

Promise.all(imageModules.map(({ module }) => module)).then(images => {
  images.forEach((image, index) => {
    const file = {
      name: `image-${index}`,
      url: image.default,
      uid: `${index}`,
      raw: {
        type: 'image/png'
      }
    };
    canvasStore.fileList.push(file);
  });
});

const handlePictureCardPreview = (file) => {
  if (file.url) {
    console.log("file.raw.type", file.raw.type)
    const isImage = file.raw.type.startsWith('image/');
    if (!isImage) {
      ElMessage.error(t('upload.only_images'));
      canvasStore.fileList = canvasStore.fileList.filter(item => item.uid !== file.uid);
    }
    canvasStore.addImage(file.url);     
  }
};


const handleRemove = (file) => {
  console.log(file)
  canvasStore.fileList = canvasStore.fileList.filter(item => item.uid !== file.uid);
};

onUnmounted(() =>{
  canvasStore.fileList = []
})
</script>

<template>
  <div class="p-3">
    <el-upload
      v-model:file-list="canvasStore.fileList"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :auto-upload="false"
      :multiple="true"
      accept="image/*"
    >
      
      <el-icon><Plus /></el-icon>
      <template #file="{ file }">
        <img
          :src="file.url"
          class="ep-upload-list__item-thumbnail"
        />
        <span class="ep-upload-list__item-actions">
          <span
            class="ep-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><SolarAddSquareBold /></el-icon>
          </span>
          <span
            class="ep-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </template>
  </el-upload>
  </div>
</template>

<style scoped>
:deep(.ep-upload-list){
  justify-content: center !important;
}
</style>