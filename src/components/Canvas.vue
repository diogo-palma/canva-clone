<script setup>
import { ref, onMounted, watch, markRaw, nextTick  } from 'vue';
import { fabric } from 'fabric';
import { useCanvasStore } from '../store/canvasStore'
import IconoirAddPageAlt from '~icons/iconoir/add-page-alt';
import IonDuplicateOutline from '~icons/ion/duplicate-outline';
import LetsIconsTrash from '~icons/lets-icons/trash';
import MingcuteUpLine from '~icons/mingcute/up-line';
import MingcuteDownLine from '~icons/mingcute/down-line';

const canvasStore = useCanvasStore();



onMounted(() => {
  canvasStore.addNewPage();
});

const resizeCanvas = () => {
  canvasStore.canvasInstances.forEach((canvas) => {
    canvas.setWidth(pageWidth.value);
    canvas.setHeight(pageHeight.value);
    canvas.renderAll();
  });
};



const setZoom = () => {
  let zoomLevel = canvasStore.zoomLevel

  if (zoomLevel < 10){
    zoomLevel = 10
  }
  zoomLevel = (zoomLevel/100);

  canvasStore.canvasInstances.forEach((canvas) => {
    canvas.setZoom(zoomLevel);
    
    canvas.setDimensions({
      width: canvasStore.pageWidth * zoomLevel,
      height: canvasStore.pageHeight * zoomLevel
    });
  })
  checkCanvasWidth()
}

watch(
  () => canvasStore.zoomLevel,
  (newVal, oldVal) => {
    setZoom();
  }
);



const checkCanvasWidth = () => {
  const editorContainer = document.querySelector('.editor-container');
  const canvasMain = document.querySelectorAll('.canvas-main');
  const canvasContainer = document.querySelector('.canvas-container');
  scrollToCenter()
  
  if (canvasContainer.scrollWidth < editorContainer.clientWidth) {
    editorContainer.classList.remove('overflow-scroll')
    canvasMain.forEach(canvas => canvas.classList.remove('start-aligned'));
  } else {
    editorContainer.classList.add('overflow-scroll')
    canvasMain.forEach(canvas => canvas.classList.add('start-aligned'));
  }
};

const scrollToCenter = () => {
  const editorContainer = document.querySelector('.editor-container');
  const canvasMain = document.querySelector('.canvas-container');
  
  // // Centralizar verticalmente
  // const containerHeight = editorContainer.clientHeight;
  // const contentHeight = canvasMain.clientHeight;
  // const scrollTopValue = Math.max(0, (contentHeight - containerHeight) / 2);
  // editorContainer.scrollTop = scrollTopValue;
  
  // Centralizar horizontalmente
  const containerWidth = editorContainer.clientWidth;
  const contentWidth = canvasMain.clientWidth;
  const scrollRightValue = Math.max(0, (contentWidth - containerWidth) / 2);
  editorContainer.scrollLeft = scrollRightValue;
};


watch([canvasStore.pageWidth, canvasStore.pageHeight], resizeCanvas);
</script>


<template>
  <div class="editor" style="position: relative">
    <div class="editor-container">
      <div id="content"  v-for="(item, index) in canvasStore.pagesCount" :key="index">

        <div class="actions" >
          <div style="display: block;margin-top: 2px;">
            <span>
              {{ $t('canvas.page') }} {{ canvasStore.pagesCount[index]}}
            </span>
          </div>  
          <div class="actions-buttons">
            <el-tooltip :content="$t('canvas.move_up')"  v-if="canvasStore.pagesCount.length > 1 && index != 0" placement="bottom" effect="light">
              <el-button color="#e8e8e8"  class="btn-actions"><MingcuteUpLine/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.move_down')" v-if="canvasStore.pagesCount.length > 1 && index != (canvasStore.pagesCount.length - 1)"  placement="bottom" effect="light">
              <el-button color="#e8e8e8" class="btn-actions"><MingcuteDownLine/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.new_page')"  placement="bottom" effect="light">
              <el-button color="#e8e8e8" @click="canvasStore.addNewPage()" class="btn-actions"><IconoirAddPageAlt/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.duplicate')" placement="bottom" effect="light">
              <el-button color="#e8e8e8" class="btn-actions"><IonDuplicateOutline/></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('canvas.remove')" placement="bottom" v-if="canvasStore.pagesCount.length > 1"  effect="light">
              <el-button color="#e8e8e8" class="btn-actions"><LetsIconsTrash/></el-button>
            </el-tooltip>
            
          </div>
        </div>
        <div :id="'canvas'+ (+index + +1) " class="canvas-main">

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
