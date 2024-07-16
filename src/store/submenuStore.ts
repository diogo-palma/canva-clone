import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import Layers from '../components/submenu/Layers.vue'
import Text from '../components/submenu/Text.vue'
import Shapes from '../components/submenu/Shapes.vue'
import Effects from '../components/submenu/Effects.vue'
import Animations from '../components/submenu/Animations.vue'
import Photos from '../components/submenu/Photos.vue'
import Upload from '../components/submenu/Upload.vue'
import Background from '../components/submenu/Background.vue'
import Resize from '../components/submenu/Resize.vue'
import Templates from '../components/submenu/Templates.vue'


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
      
      if (active != 'effects' ){
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
        Animations,
        Photos,
        Upload,
        Background,
        Resize,
        Templates
      };
      
      this.currentComponent = markRaw(availableComponents[componentName]) || null;
      console.log(componentName)
    },
  }
})