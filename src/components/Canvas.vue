<template>
  <div class="editor" style="position: relative">
    <div class="editor-container">
      <div class="buttons">
        <input type="number" v-model="pageWidth" placeholder="Width" />
        <input type="number" v-model="pageHeight" placeholder="Height" />
        <button @click="zoomIn">Zoom In</button>
        <button @click="zoomOut">Zoom Out</button>
        <button @click="addCanvas">Add Page</button>
        <button @click="addText">Add Text</button>
        <button @click="addCircle">Add Circle</button>
      </div>
      <div id="content" class="canvas-main">
        
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, watch, markRaw } from 'vue';
import { fabric } from 'fabric';
import { useCanvasStore } from '../store/canvasStore'

const canvasStore = useCanvasStore();

const canvasInstances = ref([]);
const activePageIndex = ref(0)

const pageWidth = ref(500);
const pageHeight = ref(500);
const zoomLevel = ref(1);

const addCanvas = () => {
  const content = document.getElementById("content");
  const newCanvasElement = document.createElement("canvas");
  
  newCanvasElement.width = pageWidth.value;
  

  content.appendChild(newCanvasElement);
  const fabricCanvasObj = new fabric.Canvas(newCanvasElement, {
    width: pageWidth.value,
    height: pageWidth.value
  });
  canvasInstances.value.push(fabricCanvasObj);
  
  fabricCanvasObj.on('mouse:up', () => {
    console.log("oi")
    const canvasIndex = canvasInstances.value.indexOf(fabricCanvasObj);
    setActivePage(canvasIndex);
  });

  setActivePage(canvasInstances.value.length - 1);
};

const addText = () => {
  const canvas = canvasInstances.value[activePageIndex.value];

  const text = new fabric.Textbox('Sample Text', {
    left: 10,
    top: 10,
    width: 200,
    selectable: true,
    hasControls: true,
    hasBorders: true
  });
  canvas.add(markRaw(text)).renderAll();
};

const addCircle = () => {
  const canvas = canvasInstances.value[activePageIndex.value];
  const circle = new fabric.Circle({
    radius: 50,
    left: 10,
    top: 10,
    selectable: true,
    hasControls: true,
  });
  canvas.add(markRaw(circle)).renderAll();
};

const setActivePage = (index) => {
  console.log(index)
  activePageIndex.value = index;
  const canvasContainers = document.querySelectorAll(".canvas-container");
  canvasContainers.forEach((container, i) => {
    if (i === index) {
      container.classList.add("active-canvas");
    } else {
      container.classList.remove("active-canvas");
    }
  });
};

onMounted(() => {
  addCanvas();
});

const resizeCanvas = () => {
  canvasInstances.value.forEach((canvas) => {
    canvas.setWidth(pageWidth.value);
    canvas.setHeight(pageHeight.value);
    canvas.renderAll();
  });
};


const zoomIn = () => {
  canvasInstances.value.forEach((canvas) => {
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.1); 
    canvas.setWidth(pageWidth.value * canvas.getZoom());
    canvas.setHeight(pageHeight.value * canvas.getZoom());
    canvas.renderAll();
  });
  checkCanvasWidth()
};

const zoomOut = () => {
  canvasInstances.value.forEach((canvas) => {
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom / 1.1); 
    canvas.setWidth(pageWidth.value * canvas.getZoom());
    canvas.setHeight(pageHeight.value * canvas.getZoom());
    canvas.renderAll();
  });
  checkCanvasWidth()
};

const setZoom = () => {
  let zoomLevel = (canvasStore.zoomLevel/100);
  canvasInstances.value.forEach((canvas) => {
    canvas.setZoom(zoomLevel);
    
    canvas.setDimensions({
      width: pageWidth.value * zoomLevel,
      height: pageHeight.value * zoomLevel
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
  const canvasMain = document.querySelector('.canvas-main');
  scrollToCenter()
  
  if (canvasMain.scrollWidth < editorContainer.clientWidth) {
    editorContainer.classList.remove('overflow-scroll')
    canvasMain.classList.remove('start-aligned');
  } else {
    editorContainer.classList.add('overflow-scroll')
    canvasMain.classList.add('start-aligned');    
  }
};

const scrollToCenter = () => {
  const editorContainer = document.querySelector('.editor-container');
  const canvasMain = document.querySelector('.canvas-container');
  
  // Centralizar verticalmente
  const containerHeight = editorContainer.clientHeight;
  const contentHeight = canvasMain.clientHeight;
  const scrollTopValue = Math.max(0, (contentHeight - containerHeight) / 2);
  editorContainer.scrollTop = scrollTopValue;
  
  // Centralizar horizontalmente
  const containerWidth = editorContainer.clientWidth;
  const contentWidth = canvasMain.clientWidth;
  const scrollRightValue = Math.max(0, (contentWidth - containerWidth) / 2);
  editorContainer.scrollLeft = scrollRightValue;
};


watch([pageWidth, pageHeight], resizeCanvas);
</script>

<style scoped>
.editor{
  position: relative;
  width: 100%;
  height: 79vh;
}
.editor-container {
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden scroll;
  background: #e8e8e8;
  position: absolute;
}

.buttons {
  margin-bottom: 20px;
}
:deep(.canvas-container){
  border: 1px solid #000;
  background: #fff;
}

:deep(.active-canvas) {
  border-color: red;
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
