<script setup lang="ts">

</script>

<template>
  <div style="margin: 10px;">
    <span style="font-weight: 600;font-size: 16px;">{{ $t('menu_header.animations') }}</span>
    <div class="mt-4">
      <span style="font-size: 14px">{{ $t('menu_header.subtle')}}</span>
    </div>
    <el-row class="mt-2">
      <el-col>
       <ElevationAnimation/>
      </el-col>
    </el-row>
    
  </div>
</template>

<style scoped>

</style>