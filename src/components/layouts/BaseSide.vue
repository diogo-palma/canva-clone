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

const { t } = useI18n();

const menus = [
  { icon: HugeiconsGeometricShapes01, text: 'sidebar.shapes' },
];
</script>

<style scoped>
.vertical-menu {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e8e8e8;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  color: #cac1c1;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 5px;
}

.menu-text {
  font-size: 12px;
}
</style>
