<script lang="ts" setup>
import { toggleDark } from "~/composables";
</script>

<template>
  <el-menu class="el-menu-demo" 
    mode="horizontal"
    :ellipsis="false"
    >
    <el-menu-item index="1">
      <span class="logo">
        C
      </span>      
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <span style="color: white">
          {{ $t('header.file') }}
        </span>
      </template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <div class="flex-grow" />
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
    <LocaleChanger/>
  </el-menu>
</template>

<style scoped>
.logo {
  font-size: 2em;
  font-weight: bold;
  line-height: 60px;
  width: 69px;
}

.el-menu-demo {
  background: linear-gradient(to right, #07bccd, #4371db, #6f3ce5);
}

</style>
