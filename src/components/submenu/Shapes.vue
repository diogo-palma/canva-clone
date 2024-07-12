<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';

const canvasStore = useCanvasStore();

const lines = ref([]);
const shapes = ref([]);
const isLoading = ref(true);



const fetchFileCreationDate = async (path) => {
  const url  = window.location.href.replace(/\/$/, '') + path
  
  const response = await fetch(url).then( async resp => {    
    const creationDate = await resp.headers.get('Last-Modified');
    
    return creationDate;
  })

  return response
  
  
};

const sortAndMapEntries = async (entries) => {
  const sortedEntries = [];
  for (const entry of entries) {
    const creationDate = await fetchFileCreationDate(entry[0]);
    sortedEntries.push({ default: entry[0], module: entry[1], creationDate });
  }
  console.log("sortedEntries", sortedEntries)

  return sortedEntries.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
};
const addSvg = (url) => {
  const newUrl = window.location.href.replace(/\/$/, '') + url.split('?')[0];
  canvasStore.addSvg(newUrl);
};

onMounted(async () => {

  const lineImports = await sortAndMapEntries(Object.entries(import.meta.glob('~/assets/lines/*.svg')));
  const shapeImports = await sortAndMapEntries(Object.entries(import.meta.glob('~/assets/shapes/*.svg')));
  lines.value = lineImports;
  shapes.value = shapeImports;

  const imagesLoaded = await Promise.all([...lines.value, ...shapes.value].map(image => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.src = image.default;
      });
    }))
  
  if (imagesLoaded.length === lines.value.length + shapes.value.length) {
    isLoading.value = false;
  }
  
  
});
</script>

<template>
  <div class="shapes">
    <div v-if="isLoading">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="40" stroke="#ccc" stroke-width="10" fill="none" />
        <circle cx="50" cy="50" r="40" stroke="#007bff" stroke-width="10" fill="none" stroke-dasharray="180 200" transform="rotate(90 50 50)">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
        </circle>
      </svg>
    </div>
    <div v-else>
      <span class="title-shape">{{$t('shapes.lines')}}</span>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col v-for="(line, index) in lines" :key="index" :span="8" >
          <img :src="line.default" class="lines" @click="addSvg(line.default)">
        </el-col>
      </el-row>
      <span class="title-shape">{{$t('shapes.shapes')}}</span>
      <el-row style="margin-top: 10px">
        <el-col v-for="(shape, index) in shapes" :key="index" :span="6">
          <img :src="shape.default" class="filterit" @click="addSvg(shape.default)">
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<style scoped>
.shapes{
  padding: 10px;
}

.lines {
  width: 100%;
  height: 25px;
  filter: invert(100%);
  cursor: pointer;
}

.ep-col {
  margin-bottom: 20px;
}

.title-shape{
  font-size: 12px;
  font-weight: 600;
}

.filterit {
  filter: invert(100%);
  cursor: pointer;
}

</style>