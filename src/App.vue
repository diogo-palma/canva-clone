<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide />
      <div w="full">
        <BaseContent/>
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {  
  color: var(--ep-text-color-primary);
}

.main-container {
  height: 93vh;
}
</style>
