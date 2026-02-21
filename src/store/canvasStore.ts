import { defineStore } from 'pinia'
import { canvasState } from './canvas/state'
import { canvasActions } from './canvas/actions'
import { canvasGetters } from './canvas/getters'

export const useCanvasStore = defineStore('canvasStore', {
  state: canvasState,
  actions: canvasActions,
  getters: canvasGetters,
})
