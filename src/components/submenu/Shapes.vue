<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';

const canvasStore = useCanvasStore();

const lines = ref([]);
const shapes = ref([]);
const isLoading = ref(true);

const lineImports = import.meta.glob('~/assets/lines/*.svg', { eager: true });
const shapeImports = import.meta.glob('~/assets/shapes/*.svg', { eager: true });

const sortAndMapEntries = async (entries) => {
  return Object.entries(entries)
    .sort((a, b) => {
      const aName = a[0].split('/').pop();
      const bName = b[0].split('/').pop();
      
      if (aName < bName) return 1;
      if (aName > bName) return -1;
      return 0;
    })
    .map(entry => entry[1]);
};

const addSvg = (url) => {
  const newUrl = window.location.href.replace(/\/$/, '') + url.split('?')[0];
  canvasStore.addSvg(newUrl);
};

onMounted(async () => {
  lines.value = await sortAndMapEntries(lineImports);
  shapes.value = Object.values(shapeImports);
  
  isLoading.value = false;  
  
  
});
</script>

<template>
  <div class="shapes" v-loading="isLoading">
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
</template>


<style scoped>
.shapes{
  padding: 10px;
}

.lines {
  width: 100%;
  height: 25px;
  filter: invert(100%);
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
}

</style>