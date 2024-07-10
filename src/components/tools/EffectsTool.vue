<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useSubmenuStore } from '../../store/submenuStore'
import { useI18n } from 'vue-i18n';
import MaterialSymbolsEvShadowOutline from '~icons/material-symbols/ev-shadow-outline';
import { watch } from "vue";


const { t } = useI18n();
const canvasStore = useCanvasStore();
const submenuStore = useSubmenuStore();


</script>

<template>
  <div class="effects" v-if="canvasStore.selectedObjectType != 'groups'">
    <el-button @click="submenuStore.openSubmenu('effects', 'Effects')" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextStrikethrough }">
      <MaterialSymbolsEvShadowOutline/> <span style="margin-left: 3px">{{$t('menu_header.effects')}}</span>
    </el-button>
  </div>
</template>



<style scoped>
.effects{
  margin-left: 5px;
}
</style>