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
    selectedObjectColor: '',
    selectedObjectType: null,
    selectedFont: null,
    fontSize: 30,
    selectedTextAlign: 'center',
    selectedTextBold: false,
    selectedTextUnderline: false,
    selectedTextItalic: false,
    selectedTextStrikethrough: false,
    selectedLineHeight: 100,
    selectedLetterSpace: 0,
    selectedTextStroke: 1,
    selectedTextStrokeColor: "#000",
    selectedTextBackgroundColor: '',
    selectedBackgroundPadding: 0,
    selectedBackgroundCornerRadius: 0,
    selectedShadowColor: '',
    selectedShadowOffSetX: 5,
    selectedShadowOffSetY: 5,
    selectedShadowBlur: 0,
    selectedBlur: 0,
    selectedAnimationDuration: 1,
    selectdElevationAnimationInitial: 0,
    selectdElevationAnimationFinal: 0
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

      fabricCanvasObj.devicePixelRatio = 2;

      new ControlsPlugin();

      

      let isScaling = false;
      let isMoving = false;

      const saveStateOnEvent = () => {
        this.saveCanvasState();
      };
    
      const handleScalingStart = () => {
        isScaling = true;
        this.changeBackgroundCornerRadius
      };
    
      const handleMouseUp = () => {
        if (isScaling || isMoving) {
          saveStateOnEvent();
          isScaling = false;
          isMoving = false;
        }
        const canvasIndex = this.canvasInstances.findIndex(instance => instance.canvas === fabricCanvasObj);
        this.setActivePage(canvasIndex);
      };

      const handleSelectionChanged = () => {
        const activeObject = fabricCanvasObj.getActiveObject();
        this.updateObjectSelection(!!activeObject);
        if (activeObject) {
          this.checkObjectType(fabricCanvasObj);
          const canvasIndex = this.canvasInstances.findIndex(instance => instance.canvas === fabricCanvasObj);
          const layerIndex = fabricCanvasObj.getObjects().indexOf(activeObject);
          if (layerIndex > -1){
            this.setActiveLayer(canvasIndex, layerIndex);
            this.updateSelectedObjectColor(activeObject);
          }
        }
      };

      const handleMovingStart = () => {
        isMoving = true;
      };
      


      fabricCanvasObj.on('object:moving', handleMovingStart);
      fabricCanvasObj.on('object:scaling', handleScalingStart);
      fabricCanvasObj.on('mouse:up', handleMouseUp);
      fabricCanvasObj.on('object:rotating', saveStateOnEvent);
      fabricCanvasObj.on('selection:created', handleSelectionChanged);
      fabricCanvasObj.on('selection:updated', handleSelectionChanged);
      fabricCanvasObj.on('selection:cleared', handleSelectionChanged);
      fabricCanvasObj.on('object:modified', this.changeBackgroundCornerRadius)
      
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
    
      const tempText = new fabric.Textbox(attributes.text, {
        ...attributes
      });
    
      const textWidth = tempText.width;
      const textHeight = tempText.height;
      
      
      if (lastLeft + textWidth > (this.pageWidth * this.zoomLevel/100)) {
        lastLeft =80;
      }
    
      
      if (lastTop + textHeight > (this.pageHeight* this.zoomLevel/100)) {
        lastTop = 80;
      }

      
    
      const addText = new fabric.Textbox(attributes.text, {
        left: lastLeft,
        top: lastTop,
        width: textWidth + 40,
        textAlign: 'center',
        ...attributes
      });
    
      canvas.add(markRaw(addText)).setActiveObject(addText);
      canvas.renderAll();
      this.saveCanvasState();
    },
    changeFont(font: string) {
      this.selectedFont = font; 
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('fontFamily', font); 
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeLineHeight(lineHeight: number) {      
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
          activeObject.set('lineHeight', lineHeight );
          canvas.renderAll();
          this.saveCanvasState();
      }
    },
    changeLetterSpacing(letterSpacing: number) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
          activeObject.set('charSpacing', letterSpacing);
          this.selectedLetterSpace = letterSpacing
          canvas.renderAll();
          this.saveCanvasState();
      }
    },
    changeTextAlign(alignment: string) {
      this.selectedTextAlign = alignment;
      
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('textAlign', alignment);
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeBold() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        const isBold = activeObject.get('fontWeight') === 'bold';
        this.selectedTextBold = !isBold
        activeObject.set('fontWeight', isBold ? 'normal' : 'bold');
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeTextStroke() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('strokeWidth', this.selectedTextStroke);
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeTextStrokeColor() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('stroke', this.selectedTextStrokeColor); 
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeBackgroundColor() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
  
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('backgroundColor', this.selectedTextBackgroundColor);
        if (this.selectedBackgroundPadding > 0){
          this.changeBackgroundPadding()
        }
        if (this.selectedBackgroundCornerRadius > 0){
          this.changeBackgroundPadding()
        }
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeBackgroundPadding() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        const padding = this.selectedBackgroundPadding; 
    
        activeObject.set('textPadding', padding);

        if (this.selectedBackgroundCornerRadius){
          this.changeBackgroundCornerRadius()
          return
        }

        if (activeObject.backgroundRect) {
          canvas.remove(activeObject.backgroundRect);
        }
    
        const rectWidth = activeObject.width + padding * 2;
        const rectHeight = activeObject.height + padding * 2;
        
        const backgroundRect = new fabric.Rect({
          left: activeObject.left - padding,
          top: activeObject.top - padding,
          width: rectWidth,
          height: rectHeight,
          fill: this.selectedTextBackgroundColor,
          selectable: false,
          evented: false
        });
    
        canvas.add(backgroundRect);
        canvas.sendToBack(backgroundRect);
    
        activeObject.backgroundRect = backgroundRect;
    
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeBlur() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
  
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.setBlur(this.selectedBlur);
        canvas.renderAll();
      }
    },
    changeBackgroundCornerRadius() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        const cornerRadius = this.selectedBackgroundCornerRadius; 
        activeObject.set('cornerRadius', cornerRadius);        
        activeObject.set('backgroundColor', 'transparent');
        if (activeObject.backgroundRect) {
          canvas.remove(activeObject.backgroundRect);
        }
        const padding = this.selectedBackgroundPadding || 1
        const rectWidth = activeObject.width * activeObject.scaleX + padding * 2;
        const rectHeight = activeObject.height * activeObject.scaleY  + padding * 2;
        const backgroundRect = new fabric.Rect({
          left: activeObject.left - padding,
          top: activeObject.top - padding,
          width: rectWidth,
          height: rectHeight,
          fill: this.selectedTextBackgroundColor,
          selectable: false,
          evented: false,
          rx: cornerRadius,
          ry: cornerRadius
        });
        canvas.add(backgroundRect);
        canvas.sendToBack(backgroundRect);
        activeObject.backgroundRect = backgroundRect;
        
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeUnderline() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        const isUnderline = activeObject.get('underline');
        this.selectedTextUnderline = !isUnderline;
        activeObject.set('underline', !isUnderline);
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeItalic() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        const isItalic = activeObject.get('fontStyle') === 'italic';
        this.selectedTextItalic = !isItalic;
        activeObject.set('fontStyle', isItalic ? 'normal' : 'italic');
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeStrikethrough() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        const isLinethrough = activeObject.get('linethrough');
        this.selectedTextStrikethrough = !isLinethrough;
        activeObject.set('linethrough', !isLinethrough);
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeFontSize(fontSize: number) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('fontSize', fontSize); 
        const tempText = new fabric.Textbox(activeObject.text, {
          ...activeObject.toObject(),
          fontSize: fontSize,
        });
        activeObject.set('width', tempText.width);
        this.changeBackgroundPadding()
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    animateElevation(){
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      
      const initialTop = this.selectdElevationAnimationInitial
      const finalTop = this.selectdElevationAnimationFinal
      
      if (this.selectedAnimationDuration == 0){
        this.selectedAnimationDuration = 1
      }

      const duration = this.selectedAnimationDuration  * 1000


      activeObject.set({
        top: initialTop
      });
    
      fabric.util.animate({
        startValue: initialTop,
        endValue: finalTop,
        duration: duration,  
        onChange: (value: any) => {
          activeObject.set('top', value);
          canvas.renderAll();
        },
        onComplete: () => {
          activeObject.setCoords();
        }
      });

    },
    async addSvg(svgUrl: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
  
      console.log(svgUrl)
      fabric.loadSVGFromURL(svgUrl, (objects, options) => {
        const svgObject = fabric.util.groupSVGElements(objects, options);  
        svgObject.top = 30;
        svgObject.left = 50;
        svgObject.scale(2.0)        
        canvas.add(markRaw(svgObject)).setActiveObject(svgObject);
        canvas.renderAll()
        this.saveCanvasState();
      });
    },
    updateSelectedObjectColor(activeObject: any) {
      
      if (activeObject) {
        if (activeObject.type === 'textbox' || activeObject.type === 'text') {
          this.selectedObjectColor = activeObject.fill;
        } else if (activeObject.type === 'group') {
          const firstObject = activeObject.getObjects()[0];
          if (firstObject) {
            this.selectedObjectColor = firstObject.fill;
          }
        } else if (activeObject.isType('path') || activeObject.isType('path-group') || activeObject.isType('polygon') || activeObject.isType('polyline') || activeObject.isType('circle') || activeObject.isType('rect') || activeObject.isType('line')) {
          this.selectedObjectColor = activeObject.fill || activeObject.stroke;
        } else {
          this.selectedObjectColor = activeObject.fill || activeObject.stroke;
        }
      } else {
        this.selectedObjectColor = '';
      }
    },
    changeColor(color: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();

      if (activeObject) {
        if (activeObject.type === 'textbox' || activeObject.type === 'text') {
          activeObject.set('fill', color);
        } 
        else if (activeObject.type === 'group') {
          activeObject.forEachObject((obj) => {
            if (obj.set) {
              obj.set('fill', color);
              obj.set('stroke', color);
            }
          });
        }         
        else if (activeObject.isType('path') || activeObject.isType('path-group') || activeObject.isType('polygon') || activeObject.isType('polyline') || activeObject.isType('circle') || activeObject.isType('rect') || activeObject.isType('line')) {
          activeObject.set('fill', color);
          activeObject.set('stroke', color);
        } else {
          activeObject.set('fill', color);
          activeObject.set('stroke', color);
        }

        canvas.renderAll();
        this.saveCanvasState();
      }
    },   
    changeShadow() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('shadow', { color: this.selectedShadowColor,  offsetX: this.selectedShadowOffSetX,  offsetY: this.selectedShadowOffSetY, blur: this.selectedShadowBlur });
        canvas.renderAll();
        this.saveCanvasState();
      }
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
    checkObjectType(obj: any) {      
      this.selectedObjectType = obj.getActiveObject().get('type')
      console.log(this.selectedObjectType)
      const activeObject = obj.getActiveObject();
      if (activeObject.type === 'text' || activeObject.type === 'textbox') {        
        this.selectedFont = activeObject.fontFamily;
        this.fontSize = activeObject.fontSize;
        this.selectedTextAlign = activeObject.textAlign;
        const isBold = activeObject.get('fontWeight') === 'bold';
        this.selectedTextBold = isBold;
        const isUnderline = activeObject.get('underline');
        this.selectedTextUnderline = isUnderline
        const isItalic = activeObject.get('fontStyle') === 'italic';
        this.selectedTextItalic = isItalic;
        const isLinethrough = activeObject.get('linethrough');
        this.selectedTextStrikethrough = isLinethrough;
        this.selectedLineHeight = activeObject.get('lineHeight') * 10
        this.selectedBackgroundPadding = activeObject.get('textPadding');
        this.selectedTextBackgroundColor = activeObject.get('backgroundColor');
        this.selectedBackgroundCornerRadius = activeObject.get('cornerRadius')
        this.selectdElevationAnimationInitial = obj.height;
        this.selectdElevationAnimationFinal = activeObject.top
        if (activeObject.backgroundRect) {
          if (activeObject.backgroundRect.get('fill'))
            this.selectedTextBackgroundColor = activeObject.backgroundRect.get('fill');
          
        }
        console.log("this.selectedTextBackgroundColor", this.selectedTextBackgroundColor)
      }
    }
  },
  getters: {
    currentCanvasState: (state) => state.canvasHistory[state.canvasHistoryIndex],
    canUndo: (state) => state.canvasHistoryIndex > 0,
    canRedo: (state) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
    isThisObjectSelected: (state) => state.isObjectSelected,
  }
});