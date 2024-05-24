import { defineStore } from 'pinia';
import { fabric } from 'fabric';
import { nextTick } from 'vue';

export const useCanvasStore = defineStore('canvasStore', {
  state: () => ({
    canvasInstances: [] as fabric.Canvas[],
    pagesCount: [1] as number[],
    canvasHistory: [] as any[],
    canvasHistoryIndex: -1,
    zoomLevel: 47,
    pageWidth: 1080,
    pageHeight: 1080,
    idPage: 0,
    activePageIndex: 0
  }),
  actions: {
    async addNewPage(){
      this.idPage = this.canvasInstances.length + 1;
      if (!this.pagesCount.includes(this.idPage)){
        this.pagesCount.push(this.idPage);
      }
      await nextTick();
      const canvasInstace = await this.addPage("canvas" + this.idPage)
      this.addCanvasInstance(canvasInstace)
    },
    async addPage(contentCanvas: string) {      
      
      const content = document.getElementById(contentCanvas);
      const newCanvasElement = document.createElement("canvas");
      
      newCanvasElement.width = this.pageWidth * (this.zoomLevel/100);
      newCanvasElement.height = this.pageHeight * (this.zoomLevel/100);
      
      content?.appendChild(newCanvasElement);
      const fabricCanvasObj = new fabric.Canvas(newCanvasElement, {
        width: this.pageWidth * (this.zoomLevel/100),
        height: this.pageHeight *  (this.zoomLevel/100)
      });

      
      fabricCanvasObj.on('mouse:up', () => {
        const canvasIndex = this.canvasInstances.indexOf(fabricCanvasObj);
        this.setActivePage(canvasIndex);
      });

      content?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.setActivePage(this.canvasInstances.length )
      return fabricCanvasObj;

    },
    setActivePage(index) {
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
    addCanvasInstance(canvas: fabric.Canvas) {
      this.canvasInstances.push(canvas);      
      this.saveCanvasState();
    },
    removeCanvasInstance() {
      if (this.canvasInstances.length > 1) {
        this.canvasInstances.pop();
        this.pagesCount.pop();
        this.saveCanvasState();
      }
    },
    saveCanvasState() {
      if (this.canvasHistoryIndex < this.canvasHistory.length - 1) {
        this.canvasHistory.splice(this.canvasHistoryIndex + 1);
      }
      const allCanvasStates = this.canvasInstances.map(canvas => canvas.toJSON());
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
        console.log("Redoing to index:", this.canvasHistoryIndex);
        this.loadCanvasState(this.canvasHistory[this.canvasHistoryIndex]);
      }
    },
    async loadCanvasState(historyState: any) {
      if (!historyState) return;
      console.log("Loading canvas state:", historyState);
      this.pagesCount = [...historyState.pagesCount];

      await nextTick()
      
      while (this.canvasInstances.length < historyState.states.length) {
        const newCanvasId = `canvas${this.canvasInstances.length + 1}`;                
        const newCanvas = await this.addPage(newCanvasId)
        this.canvasInstances.push(newCanvas);
        
      }

      while (this.canvasInstances.length > historyState.states.length) {
        this.canvasInstances.pop();
        this.setActivePage(this.canvasInstances.length - 1)
      }

      for (let index = 0; index < historyState.states.length; index++) {
        const state = historyState.states[index];
        const canvas = this.canvasInstances[index];
        if (canvas) {
          await new Promise<void>((resolve) => {
            canvas.loadFromJSON(state, () => {
              canvas.renderAll();
            });
          });
        } else {
          console.error("Canvas instance not found for index:", index);
        }
      }
    },
    setZoomLevel(newZoomLevel: number) {
      this.zoomLevel = newZoomLevel;
    }
  },
  getters: {
    currentCanvasState: (state) => state.canvasHistory[state.canvasHistoryIndex],
    canUndo: (state) => state.canvasHistoryIndex > 0,
    canRedo: (state) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
  }
});
