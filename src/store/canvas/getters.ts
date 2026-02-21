export const canvasGetters = {
  currentCanvasState: (state: any) => state.canvasHistory[state.canvasHistoryIndex],
  canUndo: (state: any) => state.canvasHistoryIndex > 0,
  canRedo: (state: any) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
  isThisObjectSelected: (state: any) => state.isObjectSelected,
}
