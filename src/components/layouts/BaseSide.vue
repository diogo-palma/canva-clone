<template>
  <div class="vertical-menu">
    <div class="menu-item" v-for="(menu, index) in menus" :key="index">
      <component :is="menu.icon" class="menu-icon" />
      <span class="menu-text">{{ $t(menu.text) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HugeiconsGeometricShapes01 from '~icons/hugeicons/geometric-shapes-01';
import IconParkOutlineText from '~icons/icon-park-outline/text';
import PhPixLogoBold from '~icons/ph/pix-logo-bold';
import EpUploadFilled from '~icons/ep/upload-filled';

const { t } = useI18n();

const menus = [
  { icon: HugeiconsGeometricShapes01, text: 'sidebar.shapes' },
  { icon: IconParkOutlineText, text: 'sidebar.text'},
  { icon: PhPixLogoBold, text: 'sidebar.logo' },
  { icon: EpUploadFilled, text: 'sidebar.upload' },
];
</script>

<style scoped>
.vertical-menu {
  width: 120px;
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
