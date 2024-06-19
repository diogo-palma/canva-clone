<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';
import MingcuteUnderlineLine from '~icons/mingcute/underline-line';

const { t } = useI18n();
const canvasStore = useCanvasStore();
</script>

<template>
  <div class="text-underline">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('menu_header.underline')"
      placement="bottom"
    >
      <el-button @click="canvasStore.changeUnderline" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextUnderline }">
        <MingcuteUnderlineLine/>
      </el-button>
    </el-tooltip>
  </div>
</template>



<style scoped>
.text-underline{
  margin-left: 5px;
}
</style>