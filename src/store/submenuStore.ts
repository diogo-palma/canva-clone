import { defineStore } from 'pinia';

export const useSubmenuStore = defineStore('submenu', {
  state: () => ({
    isOpen: false,
    activeMenu: null,
  }),
  actions: {
    openSubmenu(active: string) {
      this.activeMenu = active;
      this.isOpen = true;
    },
    closeSubmenu() {
      this.activeMenu = null;
      this.isOpen = false;
    },
  }
})