<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useSubmenuStore } from '../../store/submenuStore'
import { useI18n } from 'vue-i18n';
import TdesignAnimation1 from '~icons/tdesign/animation-1';


const { t } = useI18n();
const canvasStore = useCanvasStore();
const submenuStore = useSubmenuStore();
</script>

<template>
  <div class="animations">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('menu_header.strike_through')"
      placement="bottom"
    >
      <el-button @click="submenuStore.openSubmenu('animations', 'Animations')" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextStrikethrough }">
        <TdesignAnimation1/> <span style="margin-left: 3px">{{$t('menu_header.animations')}}</span>
      </el-button>
    </el-tooltip>
  </div>
</template>


<style scoped>
.animations{
  margin-left: 5px;
}

</style>