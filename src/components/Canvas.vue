<script setup>
import { ref, onMounted, watch, markRaw, nextTick, onUpdated  } from 'vue';
import debounce from 'lodash/debounce'
import { useCanvasStore } from '../store/canvasStore'
import IconoirAddPageAlt from '~icons/iconoir/add-page-alt';
import IonDuplicateOutline from '~icons/ion/duplicate-outline';
import LetsIconsTrash from '~icons/lets-icons/trash';
import MingcuteUpLine from '~icons/mingcute/up-line';
import MingcuteDownLine from '~icons/mingcute/down-line';

const canvasStore = useCanvasStore();

const loading = ref(true)



onMounted(async () => {
  
  await nextTick()
  setTimeout(() => {
    const contentElement = document.querySelector('.editor');
    
    const width = contentElement.offsetWidth - 100;
    console.log(width)
    const height = contentElement.offsetHeight - 100;
    console.log(height)
    canvasStore.pageWidth = width
    canvasStore.pageHeight = height
    canvasStore.addNewPage(); 
    loading.value = false  
  }, 1500);
  
 
});


watch(
  () => canvasStore.canvasHistoryIndex,
  (newVal, oldVal) => {
    console.log("newvaL canvashistory", newVal)
    
  }
)

</script>


<template>
  <div class="editor" style="position: relative" v-loading="loading">
    <div class="editor-container">
      <div id="content"  v-for="(item, index) in canvasStore.pagesCount" :key="canvasStore.pagesCount[index]">

        <div class="actions" v-if="!loading">
          <div style="display: block;margin-top: 2px;">
            <span>
              {{ $t('canvas.page') }} {{ index + 1 }}
            </span>
          </div>  
          <div class="actions-buttons">
            <el-tooltip :content="$t('canvas.move_up')"  v-if="canvasStore.pagesCount.length > 1 && index != 0" placement="bottom" effect="light">
              <el-button color="#e8e8e8" @click="canvasStore.moveCanvas(index, index-1)"  class="btn-actions"><MingcuteUpLine/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.move_down')" v-if="canvasStore.pagesCount.length > 1 && index != (canvasStore.pagesCount.length - 1)"  placement="bottom" effect="light">
              <el-button color="#e8e8e8" @click="canvasStore.moveCanvas(index, index+1)" class="btn-actions"><MingcuteDownLine/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.new_page')"  placement="bottom" effect="light">
              <el-button color="#e8e8e8" @click="canvasStore.addNewPage()" class="btn-actions"><IconoirAddPageAlt/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.duplicate')" placement="bottom" effect="light">
              <el-button color="#e8e8e8" @click="canvasStore.duplicateCanvas(index)" class="btn-actions"><IonDuplicateOutline/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.remove')" placement="bottom" v-if="canvasStore.pagesCount.length > 1"  effect="light">
              <el-button color="#e8e8e8" @click="canvasStore.removeCanvas(index)" class="btn-actions"><LetsIconsTrash/></el-button>
            </el-tooltip>
            
          </div>
        </div>
        <div :id="'canvas'+ canvasStore.pagesCount[index] " class="canvas-main">

        </div>
        
      </div>
    </div>
  </div>
  
</template>


<style scoped>
.editor{
  position: relative;
  width: 100%;
  height: 78vh;
}
.editor-container {
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden scroll;
  background: #e8e8e8;
  position: absolute;
  padding-top: 10px
}

.buttons {
  margin-bottom: 20px;
}

.actions{    
  margin-bottom: -8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.actions-buttons{
  margin-left: 15px;
  display: flex;
  flex-direction: row;
}

.btn-actions{
  padding: 7px;
  margin-left: 5px;
}

:deep(.canvas-container){
  border: 1px solid #000;
  background: #fff;
}

:deep(.active-canvas) {
  border: 2px solid #6a91f0
}

.canvas-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;  
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

canvas {
  position: inherit;
  border: 1px solid #000;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 20px; 
  
}

.start-aligned {
  align-items: start;
}
.overflow-scroll{
  overflow: scroll;
}

</style>
