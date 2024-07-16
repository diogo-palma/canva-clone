<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';
import JamBold from '~icons/jam/bold';


const { t } = useI18n();
const canvasStore = useCanvasStore();
</script>

<template>
  <div class="text-bold" v-if="canvasStore.selectedObjectType == 'i-text' || canvasStore.selectedObjectType == 'text'">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('menu_header.bold')"
      placement="bottom"
    >
      <el-button @click="canvasStore.changeBold" style="padding: 0px 4px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextBold }">
        <JamBold style="font-size: 22px"/>
      </el-button>
    </el-tooltip>
  </div>
</template>



<style scoped>
.text-bold{
  margin-left: 5px;
}
</style>