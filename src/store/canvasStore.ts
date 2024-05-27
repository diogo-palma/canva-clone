import { defineStore } from 'pinia';
import { fabric } from 'fabric';
import { nextTick } from 'vue';
import * as fabricLayer from "@arch-inc/fabricjs-layer";
import { markRaw } from 'vue';

export const useCanvasStore = defineStore('canvasStore', {
  state: () => ({
    canvasInstances: [] as { canvas: fabric.Canvas, manager: fabricLayer.LayerManager }[],
    pagesCount: [1] as number[],
    canvasHistory: [] as any[],
    canvasHistoryIndex: -1,
    zoomLevel: 47,
    pageWidth: 1080,
    pageHeight: 1080,
    idPage: 0,
    activePageIndex: 0,
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
        height: this.pageHeight * (this.zoomLevel / 100)
      }));

      const manager = markRaw(new fabricLayer.LayerManager(fabricCanvasObj));
      manager.addLayer();

      fabricCanvasObj.on('mouse:up', () => {
        const canvasIndex = this.canvasInstances.findIndex(instance => {
          return instance.canvas === fabricCanvasObj;
        });
      
        this.setActivePage(canvasIndex);
      });

      content?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.setActivePage(this.canvasInstances.length);
      return { canvas: fabricCanvasObj, manager };
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
    addCanvasInstance(instance: { canvas: fabric.Canvas, manager: fabricLayer.LayerManager }) {
      this.canvasInstances.push(instance);
      this.saveCanvasState();
    },
    removeCanvasInstance() {
      if (this.canvasInstances.length > 1) {
        const removedInstance = this.canvasInstances.pop();
        if (removedInstance) {
          removedInstance.canvas.dispose();
          removedInstance.manager.dispose();
          const canvasElement = removedInstance.canvas.lowerCanvasEl;
          if (canvasElement && canvasElement.parentNode) {
            canvasElement.parentNode.removeChild(canvasElement);
          }
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
          removedInstance.manager.dispose();
          const canvasElement = removedInstance.canvas.lowerCanvasEl;
          if (canvasElement && canvasElement.parentNode) {
            canvasElement.parentNode.removeChild(canvasElement);
          }
        }
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
    addText(text: string, fontSize: number) {
      console.log(this.canvasInstances[this.activePageIndex])
      const canvas = this.canvasInstances[this.activePageIndex].canvas;

      const addText = new fabric.Textbox(text, {
        left: 10,
        top: 10,
        width: 200,
        fontSize: fontSize,
        selectable: true,
        hasControls: true,
        hasBorders: true
      });
      canvas.add(markRaw(addText)).setActiveObject(addText).renderAll();
      this.saveCanvasState();
    },
    addLayer(canvasIndex: number) {
      const instance = this.canvasInstances[canvasIndex];
      if (instance) {
        instance.manager.addLayer();
        this.saveCanvasState();
      }
    },
    removeLayer(canvasIndex: number, layerIndex: number) {
      const instance = this.canvasInstances[canvasIndex];
      if (instance) {
        const layer = instance.manager.getLayer(layerIndex);
        if (layer) {
          instance.manager.removeLayer(layer);
          this.saveCanvasState();
        }
      }
    },
    moveLayer(canvasIndex: number, layerIndex: number, direction: 'up' | 'down') {
      const instance = this.canvasInstances[canvasIndex];
      if (instance) {
        const currentIndex = layerIndex;
        if (direction === 'up' && currentIndex < instance.manager.getLayers().length - 1) {
          instance.manager.moveLayer(currentIndex, currentIndex + 1);
        } else if (direction === 'down' && currentIndex > 0) {
          instance.manager.moveLayer(currentIndex, currentIndex - 1);
        }
        this.saveCanvasState();
      }
    }
  },
  getters: {
    currentCanvasState: (state) => state.canvasHistory[state.canvasHistoryIndex],
    canUndo: (state) => state.canvasHistoryIndex > 0,
    canRedo: (state) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
  }
});
