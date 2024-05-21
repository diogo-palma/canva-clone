<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'

</script>

<template>
  <div class="el-menu-demo ">
      <div class="logo">
        C
      </div>
      <div class="flex-align-center">
        <el-dropdown>
          <el-button color="transparent" style="width: 70px">
            {{ $t('header.file')}} <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item>Action 4</el-dropdown-item>
              <el-dropdown-item>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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

</style>
