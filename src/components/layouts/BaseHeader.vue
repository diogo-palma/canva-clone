<script lang="ts" setup>
import { useCanvasStore } from "~/store/canvasStore";


const canvasStore = useCanvasStore();
</script>

<template>
  <div class="el-menu-demo ">
      <div class="logo">
        C
      </div>
      <div class="flex-align-center">        
        <el-menu
          class="menu-dropdown"
          mode="horizontal"
          :ellipsis="false"     
        >
          <el-sub-menu index="1">
            <template #title>{{ $t('header.file')}}</template>
            <el-menu-item index="2-1">New</el-menu-item>           
            <el-sub-menu index="2-2">
              <template #title>Save as...</template>
              <el-menu-item index="2-2-1">{{ $t('header.image') }} </el-menu-item>
              <el-menu-item index="2-2-2" @click="canvasStore.saveVideo">{{ $t('header.video') }} </el-menu-item>
              <el-menu-item index="2-2-3">PDF</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          
        </el-menu>
      </div>
      <div class="flex-grow" />
      <div class="flex-align-center">
        <LocaleChanger/>
      </div>
      
      
      
  </div>
</template>

<style scoped>
.logo {
  font-size: 2em;
  font-weight: bold;    
  width: 87px;
  color: white;
  text-align: center;
}
.flex-align-center{
  display: flex;
  align-items: center;
}

.el-menu-demo {
  display: flex;
  height: 7vh;
  border-bottom: none;
  background: linear-gradient(to right, #07bccd, #4371db, #6f3ce5);
}

:deep(.ep-menu--horizontal) > .ep-sub-menu .ep-sub-menu__title{
  color: white !important
}
.ep-menu--horizontal{
  height: 50px;
}

</style>
