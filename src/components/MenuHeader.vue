<script setup lang="ts">
import SolarUndoLeftRoundBroken from '~icons/solar/undo-left-round-broken';
import SolarUndoRightRoundBroken from '~icons/solar/undo-right-round-broken';
</script>

<template>
  <el-row>
    <el-col :span="24">
      <div class="menu-header" >
        <el-button circle ><SolarUndoLeftRoundBroken/></el-button>
        <el-button circle ><SolarUndoRightRoundBroken/></el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.menu-header{
  display: flex;
  padding: 10px 20px;
  align-items: center;
  min-height: 3vh;
  box-shadow: var(--el-box-shadow);
}
</style>