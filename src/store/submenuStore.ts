import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import Layers from '../components/submenu/Layers.vue'
import Text from '../components/submenu/Text.vue'
import Shapes from '../components/submenu/Shapes.vue'

export const useSubmenuStore = defineStore('submenu', {
  state: () => ({
    isOpen: false,
    activeMenu: '',
    currentComponent: null,
  }),
  actions: {
    openSubmenu(active: string, link: string) {
      this.activeMenu = active;
      this.isOpen = true;
      this.setCurrentComponent(link)
    },
    closeSubmenu() {
      this.activeMenu = '';
      this.isOpen = false;
    },
    setCurrentComponent(componentName: string) {
      const availableComponents = {
        Layers,
        Text,
        Shapes
      };
      
      this.currentComponent = markRaw(availableComponents[componentName]) || null;
      console.log(componentName)
    },
  }
})