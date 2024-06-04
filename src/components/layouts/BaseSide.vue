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
import PhPixLogoBold from '~icons/ph/pix-logo-bold';
import EpUploadFilled from '~icons/ep/upload-filled';
import { useSubmenuStore } from '../../store/submenuStore'
import BxsLayer from '~icons/bxs/layer';
import { ref } from 'vue';

const submenuStore = useSubmenuStore();

const { t } = useI18n();


const openSubmenu = (menu) => {

  submenuStore.openSubmenu(menu.text, menu.link)
}



const menus = [
  { icon: HugeiconsGeometricShapes01, text: 'sidebar.shapes', link: 'Shapes' },
  { icon: IconParkOutlineText, text: 'sidebar.text', link: 'Text'},
  { icon: PhPixLogoBold, text: 'sidebar.logo', link: 'Logo' },
  { icon: EpUploadFilled, text: 'sidebar.upload', link: 'Upload' },
  { icon: BxsLayer, text: 'sidebar.layers', link: 'Layers' },
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
