<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';
import RadixIconsStrikethrough from '~icons/radix-icons/strikethrough';
import { ref } from "vue";

const { t } = useI18n();
const canvasStore = useCanvasStore();


</script>

<template>
  <div class="text-strike">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('menu_header.strike_through')"
      placement="bottom"
    >
      <el-button @click="canvasStore.changeStrikethrough" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextStrikethrough }">
        <RadixIconsStrikethrough/>
      </el-button>
    </el-tooltip>
  </div>
</template>


<style scoped>
.text-strike{
  margin-left: 5px;
}
</style>