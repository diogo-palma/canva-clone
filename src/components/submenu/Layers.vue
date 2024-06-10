<template>
  <div class="layer-list">
    <draggable v-model="layers" @start="drag=true" @end="drag=false" item-key="id" @change="handleChange">
      <template #item="{element}">
        <div @click="selectLayer(element.index)" class="layers" :class="{ 'active-layer': element.index === activeLayerIndex }">
          <MingcuteDotsLine/>
          <template v-if="element.object.type === 'text'">
            {{ element.object.text }}
          </template>
          <template v-else-if="element.object.type === 'path'">
            Figure
          </template>
          <template v-else-if="element.object.type === 'group'">
            Group
          </template>
          <template v-else-if="element.object.type === 'textbox'">
            {{ element.object.text }}
          </template>
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
  () => canvasStore.activePageIndex,
  () => {
    updateLayers();
  }
);

watch(
  () => canvasStore.canvasInstances[canvasStore.activePageIndex]?.activeLayerIndex,
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