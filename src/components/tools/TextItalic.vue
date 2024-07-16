<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';
import TablerItalic from '~icons/tabler/italic';

const { t } = useI18n();
const canvasStore = useCanvasStore();
</script>

<template>
  <div class="text-italic" v-if="canvasStore.selectedObjectType == 'i-text' || canvasStore.selectedObjectType == 'text'">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('menu_header.italic')"
      placement="bottom"
    >
      <el-button @click="canvasStore.changeItalic" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextItalic }">
        <TablerItalic/>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style scoped>
.text-italic{
  margin-left: 5px;
}
</style>