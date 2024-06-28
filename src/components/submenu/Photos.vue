<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getPhotos, searchPhotos } from '~/api/index';
import { Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useCanvasStore } from '~/store/canvasStore'
import { useSubmenuStore } from '~/store/submenuStore'

const canvasStore = useCanvasStore();
const submenuStore = useSubmenuStore();
const { t } = useI18n();

const photos = ref([]);
const col1 = ref([]);
const col2 = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const page = ref(1);

const fetchPhotos = async () => {
  loading.value = true;
  try {
    const newPhotos = await getPhotos(page.value, 10);
    photos.value.push(...newPhotos);
    
    distributePhotos();
    page.value++;
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
  } finally {
    loading.value = false;
  }
};

const searchPhotosAPI = async (query) => {
  loading.value = true;
  try {
    const newPhotos = await searchPhotos(query, page.value, 10);
    photos.value.push(...newPhotos);
    
    distributePhotos();    
    page.value++    
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
  } finally {
    loading.value = false;
  }
};

const distributePhotos = () => {
  col1.value = [];
  col2.value = [];
  photos.value.forEach((photo, index) => {
    if (index % 2 === 0) {
      col1.value.push(photo);
    } else {
      col2.value.push(photo);
    }
  });
};

const handleScroll = () => {
  const menuContainer = document.querySelector('.menu-container');
  if (menuContainer) {
    const bottom = menuContainer.scrollTop + menuContainer.clientHeight >= menuContainer.scrollHeight - 100;
    if (bottom && !loading.value) {
      if (searchQuery.value.trim() !== '') {
        searchPhotosAPI(searchQuery.value);
      } else {
        fetchPhotos();
      }
    }
  }
};


let searchTimer: ReturnType<typeof setTimeout> | null = null;
const searchDelay = 500;

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(() => {
    if (searchQuery.value.trim() !== '') {
      page.value = 1
      photos.value = []
      searchPhotosAPI(searchQuery.value);
    } else {
      fetchPhotos();
    }
  }, searchDelay);
};

onMounted(() => {
  fetchPhotos();
  const menuContainer = document.querySelector('.menu-container');
  if (menuContainer) {
    menuContainer.addEventListener('scroll', handleScroll);
  }
});

const handleAddImage = (url: string) => {
  if (submenuStore.activeMenu == 'Photos')
    canvasStore.addImage(url)
  else
    canvasStore.changeCanvasBackgroundImage(url)
}



watch(photos, distributePhotos);
</script>

<template>
  <el-row class="menu-container">
    <div class="search">
      <el-input
        v-model="searchQuery"
        style="width: 80%"
        :placeholder="t('photos.search_photos')"
        :prefix-icon="Search"
        @input="handleSearch"
      />
      <div style="margin: 10px">
        Search by <a href="https://unsplash.com/">Unsplash</a>
      </div>
    </div>
    <el-col :span="12">
      <div v-for="photo in col1" :key="photo.id" class="photo-item">
        <img @click="handleAddImage(photo.urls.full)" :src="photo.urls.small" :alt="photo.alt_description" />
      </div>
    </el-col>
    <el-col :span="12">
      <div v-for="photo in col2" :key="photo.id" class="photo-item">
        <img @click="handleAddImage(photo.urls.full)" :src="photo.urls.small" :alt="photo.alt_description" />
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
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  width: 100%;
  margin-top: 10px;
}

.photo-item {
  margin: 10px;
  cursor: pointer;
}

.photo-item img {
  max-width: 100%;
  height: auto;
}


</style>
