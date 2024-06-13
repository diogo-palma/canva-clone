<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCanvasStore } from "~/store/canvasStore";
import { loadFonts } from '~/utils/loadFonts'

const canvasStore = useCanvasStore();

const defaultFonts = [
  { value: 'Arial', label: 'Arial', url: null },
  { value: 'Verdana', label: 'Verdana', url: null },
  { value: 'Tahoma', label: 'Tahoma', url: null },
  { value: 'Times New Roman', label: 'Times New Roman', url: null },
  { value: 'Courier New', label: 'Courier New', url: null },
  { value: 'Georgia', label: 'Georgia', url: null },
  { value: 'Palatino', label: 'Palatino', url: null },
  { value: 'Garamond', label: 'Garamond', url: null },
  { value: 'Bookman', label: 'Bookman', url: null },
  { value: 'Comic Sans MS', label: 'Comic Sans MS', url: null },
  { value: 'Trebuchet MS', label: 'Trebuchet MS', url: null },
  { value: 'Arial Black', label: 'Arial Black', url: null },
  { value: 'Impact', label: 'Impact', url: null },
];

const fontInputRef = ref()
const fontSelectRef = ref()
const loadingFonts = ref(false);


const fonts = ref([]);
const recentFonts = ref([]);
const maxRecentFonts = 10;

const updateRecentFonts = (font: any) => {  
  recentFonts.value = recentFonts.value.filter((f) => f.value !== font.value);  
  recentFonts.value.unshift(font);  
  if (recentFonts.value.length > maxRecentFonts) {
    recentFonts.value.pop();
  }
};

const selectRecentFont = (font: any) => {
  console.log("oi")
  changeFont(font);  
  
  fontSelectRef.value.blur();
};

const changeFont = (font) => {
  
  canvasStore.selectedFont = font;
  canvasStore.changeFont(font);

  const selectedFontObj = fonts.value.find((f) => f.value === font);
  if (selectedFontObj) {
    updateRecentFonts(selectedFontObj);
  }
};

const openFontFile = () => { 
  fontInputRef.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const fontData = e.target.result;
    const fontName = file.name.split('/').pop()?.split('.')[0];
    const newFont = { label: fontName, value: fontName, url: fontData };
    fonts.value.push(newFont);
    canvasStore.selectedFont = fontData; 
    await loadFontFaces([newFont])
    changeFont(newFont.label);
    
  };
  reader.readAsDataURL(file);
};




const loadFontFaces = async (fontsObj) => {
  fontsObj.forEach((font) => {
    if (font.url) { 
      const fontFace = new FontFace(font.value, `url(${font.url})`);
      fontFace.load().then(() => {      
        document.fonts.add(fontFace);
      }).catch((error) => {
        console.error(`Erro ao carregar a fonte ${font.label}:`, error);
        fonts.value = fonts.value.filter(f => f.value !== font.value);
      });
    }
  });
};

onMounted(async () => {
  loadingFonts.value = true;
  fonts.value = await loadFonts();
  await loadFontFaces(fonts.value);
  loadingFonts.value = false;
});
</script>

<template>
  <div class="font-text" v-if="canvasStore.selectedObjectType == 'textbox' || canvasStore.selectedObjectType == 'text'">
    <el-select
      ref="fontSelectRef"
      v-model="canvasStore.selectedFont"
      filterable
      placeholder="Select Font"
      @change="changeFont"
      style="width: 120px"
      :loading="loadingFonts"
      :style="{ fontFamily: canvasStore.selectedFont }"
    >
      <template #header v-if="recentFonts.length > 0">
        <div>                  
          <div v-for="font in recentFonts" :key="font.value" @click="selectRecentFont(font.value)" class="recents-fonts" :style="{ fontFamily: font.value, cursor: 'pointer' }">
            {{ font.label }}
          </div>
        </div>
      </template>
      <template #loading>
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle cx="50" cy="50" r="40" stroke="#ccc" stroke-width="10" fill="none" />
          <circle cx="50" cy="50" r="40" stroke="#007bff" stroke-width="10" fill="none" stroke-dasharray="180 200" transform="rotate(90 50 50)">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
          </circle>
        </svg>
      </template>
      <el-option
        v-for="font in fonts"
        :key="font.value"
        :label="font.label"
        :value="font.value"
        :style="{ fontFamily: font.value }"
      />
      <template #footer>
        <el-button type="primary" @click="openFontFile">{{$t('menu_header.new_font') }}</el-button>                
      </template>
    </el-select>
    <input type="file" ref="fontInputRef" style="display: none" @change="handleFileChange">
  </div>
</template>


<style scoped>

</style>