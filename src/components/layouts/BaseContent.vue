<template>
  <div class="main">
    <div class="menu" :class="{ 'menu-open': isMenuOpen }">
      oi
      
    </div>
    <div>
      2
      <canvas></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(true);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.main {
  display: flex;
  height: 100%;
}

.menu {
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background: #252627;
}

.menu-open {
  width: 200px;
}
</style>
