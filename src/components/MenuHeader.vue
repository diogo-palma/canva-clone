<script setup lang="ts">
import SolarUndoLeftRoundBroken from '~icons/solar/undo-left-round-broken';
import SolarUndoRightRoundBroken from '~icons/solar/undo-right-round-broken';
import { useCanvasStore } from '~/store/canvasStore';

const canvasStore = useCanvasStore();

const undo = () => {
  canvasStore.undo();
};

const redo = () => {
  canvasStore.redo();
};
</script>

<template>
  <el-row>
    <el-col :span="24">
      <div class="menu-header" >
        <el-button circle :disabled="!canvasStore.canUndo" @click="undo"><SolarUndoLeftRoundBroken /></el-button>
        <el-button circle :disabled="!canvasStore.canRedo" @click="redo"><SolarUndoRightRoundBroken /></el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.menu-header{
  display: flex;
  padding: 0px 20px;
  align-items: center;
  min-height: 7vh;
  box-shadow: var(--el-box-shadow);
}
</style>