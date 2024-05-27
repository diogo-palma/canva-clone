<template>
  <div class="layer-list">
    <h3>Layers</h3>
    <ul ref="layerList" @dragover.prevent @drop="dropLayer">
      <li
        v-for="(layer, index) in activeLayers"
        :key="index"
        :class="{ active: index === activeLayerIndex }"
        draggable="true"
        @dragstart="startDrag(index)"
      >
        Layer {{ index + 1 }}
        <button @click="removeLayer(index)">Remove</button>
      </li>
    </ul>
    <button @click="addLayer">Add Layer</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';

const canvasStore = useCanvasStore();
const draggedIndex = ref(null);

const activeCanvas = computed(() => canvasStore.canvasInstances[canvasStore.activePageIndex]);
const activeLayers = computed(() => activeCanvas.value?.manager?.getLayers() || []);
const activeLayerIndex = computed(() => activeCanvas.value ? activeCanvas.value.manager.activeLayerIndex : -1);

const addLayer = () => {
  if (canvasStore.activePageIndex !== -1) {
    canvasStore.addLayer(canvasStore.activePageIndex);
  }
};

const removeLayer = (layerIndex) => {
  if (canvasStore.activePageIndex !== -1) {
    canvasStore.removeLayer(canvasStore.activePageIndex, layerIndex);
  }
};

const startDrag = (index) => {
  draggedIndex.value = index;
};

const dropLayer = (event) => {
  const target = event.target.closest('li');
  if (target) {
    const targetIndex = Array.from(target.parentNode.children).indexOf(target);
    if (draggedIndex.value !== targetIndex && draggedIndex.value !== null) {
      canvasStore.moveLayer(canvasStore.activePageIndex, draggedIndex.value, targetIndex);
      draggedIndex.value = null;
    }
  }
};
</script>

<style scoped>
.layer-list {
  margin: 1em;
  padding: 1em;
  border: 1px solid #ccc;
}

.layer-list ul {
  list-style-type: none;
  padding: 0;
}

.layer-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  border-bottom: 1px solid #eee;
  cursor: move;
}

.layer-list li.active {
  background-color: #f0f0f0;
}

.layer-list button {
  margin-left: 0.5em;
}
</style>
