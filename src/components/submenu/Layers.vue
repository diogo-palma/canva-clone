<template>
  <div class="layer-list">
    <draggable v-model="layers" @start="drag=true" @end="drag=false" item-key="id" @change="handleChange">
      <template #item="{element}">
        <div @click="selectLayer(element.index)" :class="{ 'active-layer': element.index === activeLayerIndex }">
          {{ element.object.text }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';
import draggable from 'vuedraggable';

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

    // Reordenar a lista de camadas
    const movedLayer = layers.value.splice(oldIndex, 1)[0];
    layers.value.splice(newIndex, 0, movedLayer);

    // Obter todos os objetos do canvas
    const objects = canvasInstance.canvas.getObjects();
    const movedObject = objects[oldIndex];

    // Remover o objeto da posição antiga e inseri-lo na nova posição
    objects.splice(oldIndex, 1);
    objects.splice(newIndex, 0, movedObject);

    // Atualizar a ordem dos objetos no canvas
    canvasInstance.canvas._objects = objects;
    if (newIndex === 0) {
      canvasInstance.canvas.sendToBack(movedObject);
    } else if (newIndex === objects.length - 1) {
      canvasInstance.canvas.bringToFront(movedObject);
    } else {
      objects.forEach((obj, idx) => {
        obj.moveTo(idx);
      });
    }

    // Re-renderizar o canvas
    canvasInstance.canvas.renderAll();
    updateLayers();
    activeLayerIndex.value = newIndex;
  }
};



const selectLayer = (index) => {
  activeLayerIndex.value = index
  canvasStore.setActiveLayer(canvasStore.activePageIndex, index);
};

onMounted(() => {
  updateLayers();
});

watch(
  () => canvasStore.activePageIndex,
  (newVal, oldVal) => {
    updateLayers();
  }
);
</script>

<style scoped>
.layer-list {
  margin: 1em;
  padding: 1em;
  border: 1px solid #ccc;
}
.active-layer {
  background-color: lightblue;
}
</style>