import { defineStore } from 'pinia';
import { fabric } from 'fabric';
import { nextTick } from 'vue';
import { markRaw } from 'vue';
import ControlsPlugin from '~/core/ControlHandlers';
import shortid from 'shortid'



export const useCanvasStore = defineStore('canvasStore', {
  state: () => ({
    canvasInstances: [] as { canvas: fabric.Canvas, activeLayerIndex: number }[],
    pagesCount: [1] as number[],
    canvasHistory: [] as any[],
    canvasHistoryIndex: -1,
    zoomLevel: 100,
    pageWidth: 1300,
    pageHeight: 507,
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
    selectdElevationAnimationInitialTop: 0,
    selectdElevationAnimationFinalTop: 0,
    selectdElevationAnimationInitialLeft: 0,
    selectdElevationAnimationFinalLeft: 0,
    selectedVisibility: true,
    mediaRecorder: null,
    canvasAnimations: [],
    selectedLock: false,
    removedPagesCount: []
  }),
  actions: {
    async addNewPage(move: boolean = true) {
      this.idPage = this.canvasInstances.length + 1;
      if (!this.pagesCount.includes(this.idPage)) {
        this.pagesCount.push(this.idPage);
      }
      await nextTick();
      const canvasInstance = await this.addPage("canvas" + this.idPage, move);
      this.addCanvasInstance(canvasInstance);
      return canvasInstance;
    },
    removeActiveObject(canvasIndex: number){
      this.canvasInstances.forEach((instance, index) => {
        if (index !== canvasIndex) {
          instance.canvas.discardActiveObject().renderAll();
        }
      });
    },
    async addPage(canvasId: string, move: boolean = true) {
      const content = document.getElementById(canvasId);
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
      fabricCanvasObj.setZoom(this.zoomLevel / 100)
      fabricCanvasObj.devicePixelRatio = 2;

      new ControlsPlugin();

      

      let isScaling = false;
      let isMoving = false;

      const saveStateOnEvent = () => {
        this.saveCanvasState();
      };
    
      const handleScalingStart = () => {
        isScaling = true;
        this.changeBackgroundPadding
      };
    
      const handleMouseUp = () => {
        if (isScaling || isMoving) {
          saveStateOnEvent();
          isScaling = false;
          isMoving = false;
        }
        
        const canvasIndex = this.canvasInstances.findIndex(instance => instance.canvas === fabricCanvasObj);
        console.log("canvasIndex", canvasIndex)
        this.setActivePage(canvasIndex);
        this.removeActiveObject(canvasIndex)
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
        this.changeBackgroundColor()
      };
      


      fabricCanvasObj.on('object:moving', handleMovingStart);
      fabricCanvasObj.on('object:scaling', handleScalingStart);
      fabricCanvasObj.on('mouse:up', handleMouseUp);
      fabricCanvasObj.on('object:rotating', saveStateOnEvent);
      fabricCanvasObj.on('selection:created', handleSelectionChanged);
      fabricCanvasObj.on('selection:updated', handleSelectionChanged);
      fabricCanvasObj.on('selection:cleared', handleSelectionChanged);
      fabricCanvasObj.on('object:modified', this.changeBackgroundColor)

      if (move)
        content?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      this.setActivePage(this.canvasInstances.length);
      this.removeActiveObject(this.canvasInstances.length)
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
    saveCanvasState() {
      if (this.canvasHistoryIndex < this.canvasHistory.length - 1) {
        this.canvasHistory.splice(this.canvasHistoryIndex + 1);
      }
      // const allCanvasStates = this.canvasInstances.map(instance => instance.canvas.toJSON());
      

      const allCanvasStates = this.canvasInstances.map(instance => {
        const json = instance.canvas.toJSON();
        json.objects.forEach(obj => {
          console.log("obj", JSON.stringify(obj))
          console.log("obj lock", this.selectedLock)
          const isLocked = this.selectedLock;
          console.log("isLocked", isLocked)
          obj.rotateControlsVisible = isLocked
        });
        return json;
      });
      console.log("allCanvasStates", allCanvasStates)
      this.canvasHistory.push({
        states: allCanvasStates,
        pagesCount: [...this.pagesCount],        
      });
      this.canvasHistoryIndex++;
    },
    async undo() {
      if (this.canvasHistoryIndex > 0) {
        this.canvasHistoryIndex--;
        await this.loadCanvasState(this.canvasHistory[this.canvasHistoryIndex]);
      }
    },
    async redo() {
      if (this.canvasHistoryIndex < this.canvasHistory.length - 1) {
        this.canvasHistoryIndex++;
        await this.loadCanvasState(this.canvasHistory[this.canvasHistoryIndex]);
      }
    },
    sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
    },
    async loadCanvasState(historyState: any) {
      if (!historyState) return;
      const oldPagesCount = [...this.pagesCount]
      this.pagesCount = [...historyState.pagesCount];
      
      
      await nextTick();
      console.log("this.canvasHistoryIndex", this.canvasHistoryIndex)
      console.log("this.canvasHistory", this.canvasHistory[this.canvasHistoryIndex+1])
      // await this.sleep(500)

      const oldCountMap = new Map(oldPagesCount.map((id, index) => [id, index]));
      const newCountMap = new Map(this.pagesCount.map((id, index) => [id, index]));

      
      for (const [id, oldIndex] of oldCountMap.entries()) {
        if (!newCountMap.has(id)) {
          const removedInstance = this.canvasInstances.splice(oldIndex, 1)[0];
          if (removedInstance) {
            removedInstance.canvas.dispose();
          }
        }
      }

      for (const [id, newIndex] of newCountMap.entries()) {
        if (!oldCountMap.has(id)) {
          const newCanvasId = `canvas${id}`;
          const instance = await this.addPage(newCanvasId, true);
          this.canvasInstances.splice(newIndex, 0, instance);
        }
      }

      this.setActivePage(this.canvasInstances.length -1)

     
      for (let index = 0; index < historyState.states.length; index++) {
        const state = historyState.states[index];
        const instance = this.canvasInstances[index];
        if (instance) {
          await new Promise<void>((resolve) => {
            instance.canvas.loadFromJSON(state, () => {
              instance.canvas.getObjects().forEach(obj => {
                console.log("obj", obj)
                console.log("obj get", obj.get('lockRotation'))
              if (obj.rotateControlsVisible !== undefined) {
                  obj.setControlsVisibility({
                    mt: !obj.rotateControlsVisible,
                    mb: !obj.rotateControlsVisible,
                    ml: !obj.rotateControlsVisible,
                    mr: !obj.rotateControlsVisible,
                    tl: !obj.rotateControlsVisible,
                    tr: !obj.rotateControlsVisible,
                    bl: !obj.rotateControlsVisible,
                    br: !obj.rotateControlsVisible,
                    mtr: !obj.rotateControlsVisible 
                  });
                }
              });
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
    moveCanvas(oldIndex: number, newIndex: number) {
      console.log(oldIndex, newIndex)
      const oldCanvasData = this.canvasInstances[oldIndex].canvas.toJSON()
      const newCanvasData = this.canvasInstances[newIndex].canvas.toJSON()      
            
      this.canvasInstances[newIndex].canvas.clear()
      this.canvasInstances[newIndex].canvas.loadFromJSON(oldCanvasData)

      

      this.canvasInstances[oldIndex].canvas.clear()
      this.canvasInstances[oldIndex].canvas.loadFromJSON(newCanvasData)
      
      this.saveCanvasState();
      this.setActivePage(newIndex);

      const newCanvasId = newIndex + 1
    
      const content = document.getElementById('canvas'+ newCanvasId)
      const closest = content?.closest('#content')
      closest?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    async duplicateCanvas(canvasIndex: number) {
      const canvasInstanceToDuplicate = this.canvasInstances[canvasIndex];
      if (canvasInstanceToDuplicate) {
        const duplicatedInstance = await this.addNewPage(false);
        duplicatedInstance.canvas.loadFromJSON(canvasInstanceToDuplicate.canvas.toJSON())
        // this.moveCanvas(this.canvasInstances.length - 1, canvasIndex + 1)
      } else {
        console.error("Canvas instance not found for index:", canvasIndex);
      }
    },
    removeCanvas(canvasIndex: number) {
      if (canvasIndex >= 0 && canvasIndex < this.canvasInstances.length) {
        const removedInstance = this.canvasInstances.splice(canvasIndex, 1)[0];
        if (removedInstance) {
          removedInstance.canvas.dispose();
        }

        this.pagesCount.splice(canvasIndex, 1)[0];
        
        this.setActivePage(this.canvasInstances.length > 0 ? canvasIndex : this.canvasInstances.length - 1);
        this.saveCanvasState();
        this.updateObjectSelection(false)
      }
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
    
      const newText = new fabric.Textbox(attributes.text, {
        ...attributes
      });
    
      const textWidth = newText.width;
      const textHeight = newText.height;
    
      if (lastLeft + textWidth > (this.pageWidth * this.zoomLevel / 100)) {
        lastLeft = 80;
      }
    
      if (lastTop + textHeight > (this.pageHeight * this.zoomLevel / 100)) {
        lastTop = 80;
      }
    
      const id = shortid.generate();
    
      const addText = new fabric.Textbox(attributes.text, {
        id,
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
    changeVisibility() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject) {
        activeObject.visible = !activeObject.visible; 
        this.selectedVisibility = activeObject.visible
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeLock() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject) {
        const isLocked = activeObject.lockRotation;
        activeObject.lockMovementX = !isLocked;
        activeObject.lockMovementY = !isLocked;
        activeObject.lockScalingX = !isLocked;
        activeObject.lockScalingY = !isLocked;
        activeObject.lockRotation = !isLocked;
        activeObject.setControlsVisibility({
          mt: isLocked, 
          mb: isLocked, 
          ml: isLocked, 
          mr: isLocked, 
          tl: isLocked, 
          tr: isLocked, 
          bl: isLocked, 
          br: isLocked,
          mtr: isLocked
        });
        this.selectedLock = !isLocked; 
        if (activeObject.type === 'text' || activeObject.type === 'i-text' || activeObject.type === 'textbox') {
          activeObject.editable = !isLocked;
        } 
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    removeObject() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject(); 
        canvas.renderAll();
        this.saveCanvasState();
      }
    },
    changeCanvasBackgroundColor(color: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
    
      if (canvas) {
        canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
        canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
        this.saveCanvasState();
      }
    },
    changeCanvasBackgroundImage(imageUrl: string){
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      fabric.Image.fromURL(imageUrl, (image) => {
        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / image.width,
          scaleY: canvas.height / image.height
        });        
      })
    },
    changeBackgroundPadding() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
    
        if (this.selectedBackgroundCornerRadius){
          this.changeBackgroundCornerRadius()
          return
        }

        if (activeObject.backgroundRect) {
          canvas.remove(activeObject.backgroundRect);
        }

        const padding = this.selectedBackgroundPadding || 1; 

        activeObject.set('textPadding', padding);
    
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
          id: "background"
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
        if (this.selectedBackgroundCornerRadius){
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
            ry: cornerRadius,
            id: "background"
          });
          canvas.add(backgroundRect);
          canvas.sendToBack(backgroundRect);
          activeObject.backgroundRect = backgroundRect;
          
          canvas.renderAll();
          this.saveCanvasState();
        }
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
    async animateElevation(){
      const canvas = this.canvasInstances[this.activePageeIndex].canvas;
      const activeObject = canvas.getActiveObject();
      
      console.log("activeObject", activeObject)
      const initialTop = this.selectdElevationAnimationInitialTop
      const finalTop = this.selectdElevationAnimationFinalTop
      
      if (this.selectedAnimationDuration == 0){
        this.selectedAnimationDuration = 1
      }

      const duration = this.selectedAnimationDuration  * 1000


      activeObject.set({
        top: initialTop
      });
      return new Promise((resolve) => {
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
            resolve()    
          }
        });
      })

    },
    animateLandscape(){
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      
      const initialLeft = this.selectdElevationAnimationInitialLeft
      const finalLeft = this.selectdElevationAnimationFinalLeft
      
      if (this.selectedAnimationDuration == 0){
        this.selectedAnimationDuration = 1
      }

      const duration = this.selectedAnimationDuration  * 1000


      activeObject.set({
        left: initialLeft
      });
    
      fabric.util.animate({
        startValue: initialLeft,
        endValue: finalLeft,
        duration: duration,  
        onChange: (value: any) => {
          activeObject.set('left', value);
          canvas.renderAll();
        },
        onComplete: () => {
          activeObject.setCoords();
        }
      });

    },
    animateEmerge(animationIn: boolean){
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();

      const initialLeft = this.selectdElevationAnimationInitialLeft;
      const finalLeft = this.selectdElevationAnimationFinalLeft;

      if (this.selectedAnimationDuration == 0) {
        this.selectedAnimationDuration = 1;
      }

      const duration = this.selectedAnimationDuration * 1000;

      const startValue = animationIn ? 0 : 1
      const endValue = animationIn ? 1 : 0

      activeObject.set({        
        opacity: 0 
      });

      fabric.util.animate({
        startValue: startValue,
        endValue: endValue,
        duration: duration,
        onChange: (value) => {
          activeObject.set({            
            opacity: value
          });
          canvas.renderAll();
        },
        onComplete: () => {
          activeObject.set({            
            opacity: 1
          });
          activeObject.setCoords();
        }
      });
    },
    async saveVideo() {
      const canvasInstance = this.canvasInstances[this.activePageIndex];
      const fabricCanvas = canvasInstance.canvas;

     
      
    },   
    async addSvg(svgUrl: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
      
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
    async addImage(imageUrl: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
    
      fabric.Image.fromURL(imageUrl, (image) => {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
    
        const isLandscape = image.width > image.height;
    
        if (isLandscape) {
          const scaleFactor = canvasWidth / image.width;
          image.scale(scaleFactor);
          image.set({
            top: 0,
            left: 0,
          });
        } else {
          
          const scaleFactor = canvasHeight / image.height;
          image.scale(scaleFactor);
          image.set({
            top: 0,
            left: 0,
          });
        }
    
        canvas.add(image).setActiveObject(image);
        canvas.renderAll();
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
    saveImage(imageType: string) {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      
      if (canvas) {
        
        const supportedFormats = ['png', 'jpeg', 'bmp', 'webp'];
        const format = supportedFormats.includes(imageType) ? imageType : 'png';
        const quality = (format === 'jpeg' || format === 'webp') ? 0.8 : 1.0;

        canvas.setZoom(1)
        canvas.setDimensions({
          width: this.pageWidth,
          height: this.pageHeight
        });

        const dataURL = canvas.toDataURL({
          left: 0,
          top: 0,
          format, 
          quality
        });

        let zoomLevel = this.zoomLevel

        if (zoomLevel < 10){
          zoomLevel = 10
        }
        zoomLevel = (zoomLevel/100);

        canvas.setZoom(zoomLevel);

        canvas.setDimensions({
          width: this.pageWidth * zoomLevel,
          height: this.pageHeight * zoomLevel
        });

        
    
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `canvas.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    changeShadow() {
      const canvas = this.canvasInstances[this.activePageIndex].canvas;
      const activeObject = canvas.getActiveObject();
    
      // if (activeObject && (activeObject.type === 'textbox' || activeObject.type === 'text')) {
        activeObject.set('shadow', { color: this.selectedShadowColor,  offsetX: this.selectedShadowOffSetX,  offsetY: this.selectedShadowOffSetY, blur: this.selectedShadowBlur });
        canvas.renderAll();
        this.saveCanvasState();
      // }
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
      this.selectedVisibility = activeObject.visible
      this.selectedLock = activeObject.get('lockRotation')
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
        this.selectdElevationAnimationInitialTop = obj.height;
        this.selectdElevationAnimationFinalTop = activeObject.top;
        this.selectdElevationAnimationInitialLeft = obj.width;
        this.selectdElevationAnimationFinalLeft = activeObject.left;
        if (activeObject.backgroundRect) {
          if (activeObject.backgroundRect.get('fill'))
            this.selectedTextBackgroundColor = activeObject.backgroundRect.get('fill');
          
        }
        console.log("this.selectedTextBackgroundColor", this.selectedTextBackgroundColor)
      }
    },
    setZoom(applyZoom = true) {
      let zoomLevel = this.zoomLevel;
    
      if (zoomLevel < 10) {
        zoomLevel = 10;
      }
      zoomLevel = zoomLevel / 100;
    
      this.canvasInstances.forEach((obj) => {
        const canvas = obj.canvas;
    
        if (applyZoom) {
          canvas.setZoom(zoomLevel);
        }
    
        const currentScreenWidth = this.pageWidth * zoomLevel;
        const currentScreenHeight = this.pageHeight * zoomLevel;
    
        
        canvas.setDimensions({
          width: currentScreenWidth,
          height: currentScreenHeight
        });    
    
        canvas.renderAll();
      });
    
      this.checkCanvasWidth(zoomLevel);
    },
    checkCanvasWidth(zoomLevel: number){
      const editorContainer = document.querySelector('.editor-container');
      const canvasMain = document.querySelectorAll('.canvas-main');
      const canvasContainer = document.querySelector('.canvas-container');
      this.scrollToCenter()
      
      if (canvasContainer.scrollWidth < editorContainer.clientWidth) {
        editorContainer.classList.remove('overflow-scroll')
        canvasMain.forEach(canvas => canvas.classList.remove('start-aligned'));
        document.getElementById("content").style.width = '100%'
      } else {
        document.getElementById("content").style.width = this.pageWidth * zoomLevel + "px"
        editorContainer.classList.add('overflow-scroll')
        canvasMain.forEach(canvas => canvas.classList.add('start-aligned'));
      }
    },
    scrollToCenter() {
      const editorContainer = document.querySelector('.editor-container');
      const canvasMain = document.querySelector('.canvas-container');
      
      // const containerHeight = editorContainer.clientHeight;
      // const contentHeight = canvasMain.clientHeight;
      // const scrollTopValue = Math.max(0, (contentHeight - containerHeight) / 2);
      // editorContainer.scrollTop = scrollTopValue;
        
      const containerWidth = editorContainer.clientWidth;
      const contentWidth = canvasMain.clientWidth;
      const scrollRightValue = Math.max(0, (contentWidth - containerWidth) / 2);
      editorContainer.scrollLeft = scrollRightValue;
    },
    resizeCanvas(width: number, height: number, applyZoom: boolean){
      const contentElement = document.getElementById('content');
      const maxWidth = contentElement.offsetWidth - 50;
      const maxHeight = contentElement.offsetHeight - 50;      

      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;


      const zoomLevel = Math.min(widthRatio, heightRatio)
      this.pageWidth = width
      this.pageHeight = height
      this.zoomLevel = Number (Math.round(zoomLevel * 100).toFixed(2));
      this.setZoom(applyZoom)
    
    }
  },
  getters: {
    currentCanvasState: (state) => state.canvasHistory[state.canvasHistoryIndex],
    canUndo: (state) => state.canvasHistoryIndex > 0,
    canRedo: (state) => state.canvasHistoryIndex < state.canvasHistory.length - 1,
    isThisObjectSelected: (state) => state.isObjectSelected,
  }
});