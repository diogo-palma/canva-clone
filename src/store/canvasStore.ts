import { defineStore } from 'pinia';

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
   zoomLevel: 100,

  }),
  actions: {
    setZoomLevel(zoom: number){
      this.zoomLevel = zoom
    }
  }
})