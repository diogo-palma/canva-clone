import { defineStore } from 'pinia';
import { fabric } from 'fabric';
import { nextTick } from 'vue';
import { markRaw } from 'vue';
import ControlsPlugin from '~/core/ControlHandlers';


export const useCanvasStore = defineStore('canvasStore', {
  state: () => ({
    canvasInstances: [] as { canvas: fabric.Canvas, activeLayerIndex: number }[],
    pagesCount: [1] as number[],
    canvasHistory: [] as any[],
    canvasHistoryIndex: -1,
    zoomLevel: 47,
    pageWidth: 1080,
    pageHeight: 1080,
    idPage: 0,
    activePageIndex: 0,
    isObjectSelected: false,
  }),
  actions: {
    async addNewPage() {
      this.idPage = this.canvasInstances.length + 1;
      if (!this.pagesCount.includes(this.idPage)) {
        this.pagesCount.push(this.idPage);
      }
      await nextTick();
      const canvasInstance = await this.addPage("canvas" + this.idPage);
      this.addCanvasInstance(canvasInstance);
    },
    async addPage(contentCanvas: string) {
      const content = document.getElementById(contentCanvas);
      const newCanvasElement = document.createElement("canvas");
      newCanvasElement.width = this.pageWidth * (this.zoomLevel / 100);
      newCanvasElement.height = this.pageHeight * (this.zoomLevel / 100);
      content?.appendChild(newCanvasElement);
      const fabricCanvasObj = markRaw(new fabric.Canvas(newCanvasElement, {
        width: this.pageWidth * (this.zoomLevel / 100),
        height: this.pageHeight * (this.zoomLevel / 100),
        fireRightClick: true,
        stopContextMenu: true,
        controlsAboveOverlay: true,
        imageSmoothingEnabled: false,
        preserveObjectStacking: true,
      }));

      new ControlsPlugin();

    

      let isScaling = false;

      const saveStateOnEvent = () => {
        this.saveCanvasState();
      };
    
      const handleScalingStart = () => {
        isScaling = true;
      };
    
      const handleMouseUp = () => {
        if (isScaling) {
          saveStateOnEvent();
          isScaling = false;
        }
        const canvasIndex = this.canvasInstances.findIndex(instance => instance.canvas === fabricCanvasObj);
        this.setActivePage(canvasIndex);
      };

      const handleSelectionChanged = () => {
        
        this.updateObjectSelection(!!fabricCanvasObj.getActiveObject());
        if (fabricCanvasObj){
          this.checkObjectType(fabricCanvasObj)
        }
      };


      fabricCanvasObj.on('object:moving', saveStateOnEvent);
      fabricCanvasObj.on('object:scaling', handleScalingStart);
      fabricCanvasObj.on('mouse:up', handleMouseUp);
      fabricCanvasObj.on('object:rotating', saveStateOnEvent);
      fabricCanvasObj.on('selection:created', handleSelectionChanged);
      fabricCanvasObj.on('selection:updated', handleSelectionChanged);
      fabricCanvasObj.on('selection:cleared', handleSelectionChanged);
      
      content?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.setActivePage(this.canvasInstances.length);
      return { canvas: fabricCanvasObj, activeLayerIndex: -1 };
    },
    setActivePage(index: number) {
      this.activePageIndex = index;
      const canvasContainers = document.querySelectorAll(".canvas-container");
      canvasContainers.forEach((container, i) => {
        if (i === index) {
          container.classList.add("active-canvas");
        } else {
          container.classList.remove("active-canvas");
        }
      });
    },
    addCanvasInstance(instance: { canvas: fabric.Canvas, activeLayerIndex: number }) {
      this.canvasInstances.push(instance);
      this.saveCanvasState();
    },
    removeCanvasInstance() {
      if (this.canvasInstances.length > 1) {
        const removedInstance = this.canvasInstances.pop();
        if (removedInstance) {
          removedInstance.canvas.dispose();
        }
        this.pagesCount.pop();
        this.setActivePage(this.canvasInstances.length - 1);
        this.saveCanvasState();
      }
    },
    saveCanvasState() {
      if (this.canvasHistoryIndex < this.canvasHistory.length - 1) {
        this.canvasHistory.splice(this.canvasHistoryIndex + 1);
      }
      const allCanvasStates = this.canvasInstances.map(instance => instance.canvas.toJSON());
      this.canvasHistory.push({
        states: allCanvasStates,
        pagesCount: [...this.pagesCount]
      });
      this.canvasHistoryIndex++;
    },
    undo() {
      if (this.canvasHistoryIndex > 0) {
        this.canvasHistoryIndex--;
        this.loadCanvasState(this.canvasHistory[this.canvasHistoryIndex]);
      }
    },
    redo() {
      if (this.canvasHistoryIndex < this.canvasHistory.length - 1) {
        this.canvasHistoryIndex++;
        this.loadCanvasState(this.canvasHistory[this.canvasHistoryIndex]);
      }
    },
    async loadCanvasState(historyState: any) {
      if (!historyState) return;
      this.pagesCount = [...historyState.pagesCount];
      await nextTick();
      while (this.canvasInstances.length < historyState.states.length) {
        const newCanvasId = `canvas${this.canvasInstances.length + 1}`;
        const instance = await this.addPage(newCanvasId);
        this.canvasInstances.push(instance);
      }
      while (this.canvasInstances.length > historyState.states.length) {
        const removedInstance = this.canvasInstances.pop();
        if (removedInstance) {
          removedInstance.canvas.dispose();
        }
        this.setActivePage(this.canvasInstances.length - 1);
      }
      for (let index = 0; index < historyState.states.length; index++) {
        const state = historyState.states[index];
        const instance = this.canvasInstances[index];
        if (instance) {
          await new Promise<void>((resolve) => {
            instance.canvas.loadFromJSON(state, () => {
              instance.canvas.renderAll();
              resolve();
            });
          });
        } else {
          console.error("Canvas instance not found for index:", index);
        }
      }
    },
    setZoomLevel(newZoomLevel: number) {
      this.zoomLevel = newZoomLevel;
    },
    addText(attributes: any) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      let lastLeft = 100;
      let lastTop = 100;

      if (canvas.getObjects().length > 0) {
        const lastObject = canvas.getObjects()[canvas.getObjects().length - 1];
        lastLeft = lastObject.left + lastLeft;
        lastTop = lastObject.top + lastTop;
      }

      const addText = new fabric.Text(attributes.text, {
        left: lastLeft,
        top: lastTop,
        width: 200,        
        ...attributes
      });
      
      canvas.add(markRaw(addText)).setActiveObject(addText)
     
      canvas.renderAll()
      this.saveCanvasState();
    },
    async addSvg(svgUrl: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
  
      console.log(svgUrl)
      fabric.loadSVGFromURL(svgUrl, (objects, options) => {
        const svgObject = fabric.util.groupSVGElements(objects, options);  
        svgObject.top = 30;
        svgObject.left = 50;
        svgObject.scale(2.0)        
        canvas.add(markRaw(svgObject)).setActiveObject();
        canvas.renderAll()
        this.saveCanvasState();
      });
    },
    addLayer(canvasIndex: number, object: fabric.Object) {
      const instance = this.canvasInstances[canvasIndex];
      if (instance) {
        instance.activeLayerIndex = instance.canvas.getObjects().indexOf(object);
      }
    },
    setActiveLayer(canvasIndex: number, layerIndex: number) {
      const instance = this.canvasInstances[canvasIndex];
      if (instance) {
        instance.activeLayerIndex = layerIndex;
        const object = instance.canvas.item(layerIndex);
        instance.canvas.setActiveObject(object);
        instance.canvas.renderAll();
      }
    },
    updateObjectSelection(isSelected: boolean) {
      this.isObjectSelected = isSelected;
    },
    checkObjectType(obj) {
      
      console.log(obj.getActiveObject().get('type'))
    }
  },
  getters: {
    currentCanvasState: (state) => state.canvasHistory[state.canvasHistoryIndex],
    canUndo: (state) => state.canvasHistoryIndex > 0,
    canRedo: (state) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
    isThisObjectSelected: (state) => state.isObjectSelected,
  }
});