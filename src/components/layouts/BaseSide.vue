<template>
  <div class="vertical-menu">
    <div v-for="(menu, index) in menus" :key="index" style="width: 100%">
      <div
        class="menu-item"
        @click="openSubmenu(menu, index)"
        :class="{ 'active': menu.text === submenuStore.activeMenu }"
      >
        <component :is="menu.icon" class="menu-icon" />
        <span class="menu-text">{{ $t(menu.text) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HugeiconsGeometricShapes01 from '~icons/hugeicons/geometric-shapes-01';
import IconParkOutlineText from '~icons/icon-park-outline/text';
import BiImages from '~icons/bi/images';
import EpUploadFilled from '~icons/ep/upload-filled';
import { useSubmenuStore } from '../../store/submenuStore'
import BxsLayer from '~icons/bxs/layer';
import FluentColorBackground24Regular from '~icons/fluent/color-background-24-regular';
import MdiResize from '~icons/mdi/resize';
import { ref, watch } from 'vue';
import { useCanvasStore } from '~/store/canvasStore';
import TablerTemplate from '~icons/tabler/template';

const submenuStore = useSubmenuStore();
const canvasStore = useCanvasStore();

const { t } = useI18n();


const openSubmenu = (menu) => {

  submenuStore.openSubmenu(menu.text, menu.link)
}



watch(
  () => canvasStore.changeSelected,
  (n, o) => {
    console.log("oi2", n, o)
  }
)

const menus = [
  { icon: TablerTemplate, text: 'sidebar.templates', link: 'Templates' },
  { icon: HugeiconsGeometricShapes01, text: 'sidebar.shapes', link: 'Shapes' },
  { icon: IconParkOutlineText, text: 'sidebar.text', link: 'Text'},
  { icon: BiImages, text: 'sidebar.photos', link: 'Photos' },
  { icon: EpUploadFilled, text: 'sidebar.upload', link: 'Upload' },
  { icon: FluentColorBackground24Regular, text: 'sidebar.background', link: 'Background' },
  { icon: BxsLayer, text: 'sidebar.layers', link: 'Layers' },
  { icon: MdiResize, text: 'sidebar.resize', link: 'Resize' },
];
</script>

<style scoped>
.vertical-menu {
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #18191b
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #ccc;
  width: 100%;
}
.previous-menu{
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.menu-item.active {
  background-color: #252627;
}

.menu-item:hover {
  color: white;
}

.menu-item:hover > .menu-text {
  color: white;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 5px;
  
}

.menu-text {
  font-size: 12px;
  color: #ccc;  
}
</style>
