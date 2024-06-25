import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import Layers from '../components/submenu/Layers.vue'
import Text from '../components/submenu/Text.vue'
import Shapes from '../components/submenu/Shapes.vue'
import Effects from '../components/submenu/Effects.vue'
import Animations from '../components/submenu/Animations.vue'

export const useSubmenuStore = defineStore('submenu', {
  state: () => ({
    isOpen: false,
    activeMenu: '',
    currentComponent: null,
    lastComponent: '',
    lastActive: ''
  }),
  actions: {
    openSubmenu(active: string, link: string) {
      
      if (active != 'effects' || active != 'animations' ){
        this.lastActive = active
        this.lastComponent = link
      }
      
      this.activeMenu = active;
      this.isOpen = true;
      this.setCurrentComponent(link)
    },
    closeSubmenu() {
      this.activeMenu = '';
      this.isOpen = false;
      this.lastActive = ''
      this.lastComponent = ''
    },
    setCurrentComponent(componentName: string) {
      const availableComponents = {
        Layers,
        Text,
        Shapes,
        Effects,
        Animations
      };
      
      this.currentComponent = markRaw(availableComponents[componentName]) || null;
      console.log(componentName)
    },
  }
})