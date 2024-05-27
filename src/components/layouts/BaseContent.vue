<template>
  <div class="main">
    <div class="menu" :class="{ 'menu-open': submenuStore.isOpen }">
      <div class="menu-container">
        <component :is="submenuStore.currentComponent" />
      </div>
      
    </div>
    <div v-if="submenuStore.isOpen" @click="submenuStore.closeSubmenu" class="close-submenu-container" >
      <div class="icon-container">
        <MingcuteLeftFill color="white"/>
      </div>
      
    </div>
      
    <el-main style="padding: 0px">
      <MenuHeader/>
      <Canvas/>
      <MenuFooter/>
    </el-main>
      

    
    
  </div>
</template>

<script setup lang="ts">
import MingcuteLeftFill from '~icons/mingcute/left-fill';
import { useSubmenuStore } from '../../store/submenuStore'
import Layers from '../submenu/Layers.vue';
import Text from '../submenu/Text.vue'

const submenuStore = useSubmenuStore();





</script>

<style scoped>
.main {
  display: flex;
  height: 100%;
}
.menu-container{
  width: 100%;
}

.menu {
  display: flex;
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background: #252627;
  color: white;
}

.menu-open {
  width: 300px;
}



.close-submenu-container {
  position: relative;
  z-index: 100;
}
.icon-container{
  cursor: pointer;
  position: absolute;
  top: 50%;
  background: #252627;
  padding: 10px 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.icon-container > svg{
  font-size: 13px;
  margin-left: -3px;
}
</style>
