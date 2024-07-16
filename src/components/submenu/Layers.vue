<template>
  <div class="layer-list">
    <draggable v-model="layers" @start="drag=true" @end="drag=false" item-key="id" @change="handleChange">
      <template #item="{element}">
        <div @click="selectLayer(element.index)" class="layers" :class="{ 'active-layer': element.index === activeLayerIndex }" v-if="element.object.type != 'rect'">
          <div>
            <MingcuteDotsLine style="padding-top: 6px;"/>
          </div>
          <div >
            <template v-if="element.object.type === 'text'">
              {{ element.object.text }}
            </template>
            <template v-if="element.object.type === 'line'">
              Line
            </template>
            <template v-else-if="element.object.type === 'path'">
              Figure
            </template>
            <template v-else-if="element.object.type === 'image'">
              Image
            </template>
            <template v-else-if="element.object.type === 'group'">
              Group
            </template>
            <template v-else-if="element.object.type === 'i-text'">
              {{ element.object.text }}
            </template>            
          </div>
          <div class="flex-grow"/>
          <div style="cursor: pointer;" @click.stop="selectLayer(element.index)" @click="() => canvasStore.changeVisibility(element.index)"  >
            <MdiEye v-if="element.object.visible" style="padding-top: 6px; font-size: 13px;" />
              <IconamoonEyeOffBold v-else style="padding-top: 6px; font-size: 13px;" />
          </div>
          <div class="ml-2" style="cursor: pointer;" @click.stop="selectLayer(element.index)" @click="canvasStore.changeLock(element.index)">
            <MageUnlockedFill v-if="!element.object.lockRotation" style="padding-top: 6px;font-size: 13px;"/>
            <MageLockFill v-else style="padding-top: 6px;font-size: 13px;"/>            
          </div>
          <div class="ml-2">
            <BasilTrashOutline style="padding-top: 6px;font-size: 13px;"/>
          </div>

          
         
        </div>
      </template>
    </draggable>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';
import draggable from 'vuedraggable';
import MingcuteDotsLine from '~icons/mingcute/dots-line';
import MdiEye from '~icons/mdi/eye';
import IconamoonEyeOffBold from '~icons/iconamoon/eye-off-bold';
import MageUnlockedFill from '~icons/mage/unlocked-fill';
import BasilTrashOutline from '~icons/basil/trash-outline';
import MageLockFill from '~icons/mage/lock-fill';

const canvasStore = useCanvasStore();
const layers = ref([]);
const activeLayerIndex = ref(-1);

const updateLayers = () => {
  const activePageIndex = canvasStore.activePageIndex;
  if (activePageIndex >= 0 && activePageIndex < canvasStore.canvasInstances.length) {
    const canvasInstance = canvasStore.canvasInstances[activePageIndex];
    layers.value = canvasInstance.canvas.getObjects().map((object, index) => ({
      index,
      object
    }));
    console.log("layers", JSON.stringify(layers))
    activeLayerIndex.value = canvasInstance.activeLayerIndex;
  } else {
    layers.value = [];
    activeLayerIndex.value = -1;
  }
};

const handleChange = (evt) => {
  const activePageIndex = canvasStore.activePageIndex;
  if (activePageIndex >= 0 && activePageIndex < canvasStore.canvasInstances.length) {
    const canvasInstance = canvasStore.canvasInstances[activePageIndex];
    const { newIndex, oldIndex } = evt.moved;

    const movedLayer = layers.value.splice(oldIndex, 1)[0];
    layers.value.splice(newIndex, 0, movedLayer);

    const objects = canvasInstance.canvas.getObjects();
    const movedObject = objects[oldIndex];

    objects.splice(oldIndex, 1);
    objects.splice(newIndex, 0, movedObject);

    canvasInstance.canvas._objects = objects;
    objects.forEach((obj, idx) => {
      obj.moveTo(idx);
    });

    canvasInstance.canvas.renderAll();
    updateLayers();
    activeLayerIndex.value = newIndex;
  }
};

const selectLayer = (index) => {
  activeLayerIndex.value = index;
  canvasStore.setActiveLayer(canvasStore.activePageIndex, index);
};

onMounted(() => {
  updateLayers();
});

watch(
  () => [canvasStore.activePageIndex, canvasStore.selectedVisibility, canvasStore.selectedLock, canvasStore.canvasHistoryIndex, ],
  () => {
    console.log("canvasStore.canvasHistoryIndex", canvasStore.canvasHistoryIndex)
    updateLayers();
  }
);

watch(
  () => canvasStore.canvasInstances[canvasStore.activePageIndex]?.activeLayerIndex,
  () => {
    updateLayers();
  }
);
watch(
  () => [canvasStore.selectedObjectAtBack, canvasStore.selectedObjectAtFront],
  () => {
    updateLayers();      
  }
);
</script>

<style scoped>
.layer-list {
  margin: 1em;

}
.layers{
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 8px;
  border-radius: 5px;
}

.active-layer {
  background-color: #1da1d2;
}
</style>