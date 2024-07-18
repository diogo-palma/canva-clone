<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useCanvasStore } from '~/store/canvasStore'
import axios from 'axios';
import Templates from '~/data/templates';

const URL_API = import.meta.env.VITE_API_URL;
const FOLDER_TEMPLATES = 'src/assets/templates/data/'
const canvasStore = useCanvasStore();

const templates = ref([]);
const col1 = ref([]);
const col2 = ref([]);
const loading = ref(false);


const distributeImages = () => {
  col1.value = [];
  col2.value = [];

  templates.value.forEach((template, index) => {
    if (index % 2 === 0) {
      col1.value.push(template);
    } else {
      col2.value.push(template);
    }
  });
};

onMounted(() => {
  templates.value = Templates;
  distributeImages();
  
});
</script>

<template>
  <div>
    <el-row class="menu-container">     
      <el-col :span="12">
        <div v-for="template in col1" :key="template.id" class="template-item">          
          <div>
            <img @click="canvasStore.loadDesignTemplates(template)" :src=" FOLDER_TEMPLATES + template.filename" />
          </div>
          
        </div>
        <div v-if="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="40" stroke="#ccc" stroke-width="10" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#007bff" stroke-width="10" fill="none" stroke-dasharray="180 200" transform="rotate(90 50 50)">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
            </circle>
          </svg>
        </div>
      </el-col>
      <el-col :span="12">
        <div v-for="temaplte in col2" :key="temaplte.id" class="temaplte-item">
          <img @click="canvasStore.loadDesignTemplates(template)" :src=" FOLDER_TEMPLATES + template.filename" :alt="temaplte.alt_description" />
        </div>
        <div v-if="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="40" stroke="#ccc" stroke-width="10" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#007bff" stroke-width="10" fill="none" stroke-dasharray="180 200" transform="rotate(90 50 50)">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
            </circle>
          </svg>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<style scoped>
.template-item {
  margin: 10px;
  cursor: pointer;
}

.template-item img {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
}
</style>