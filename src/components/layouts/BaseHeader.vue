<script lang="ts" setup>
import { ref } from "vue";
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';


const canvasStore = useCanvasStore();
const dialogVisible = ref(false)
const imageFormat = ref('png')
const { t } = useI18n();

const saveImage = () => {
  console.log("imageFormat.value", imageFormat.value)
  canvasStore.saveImage(imageFormat.value)
  dialogVisible.value = false
}
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
          active-text-color="#000"
          :ellipsis="false"     
        >
          <el-sub-menu index="1">
            <template #title>{{ $t('header.file')}}</template>
            <el-menu-item index="2-1">New</el-menu-item>           
            <el-sub-menu index="2-2">
              <template #title>Save as...</template>
              <el-menu-item index="2-2-1" @click="dialogVisible = true">
                {{ $t('header.image') }} 
              </el-menu-item>
              <el-menu-item index="2-2-3">PDF</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2-3" @click="canvasStore.canvasToJson">JSON</el-menu-item> 
          </el-sub-menu>
          
        </el-menu>
      </div>
      <div class="flex-grow" />
      <div class="flex-align-center">
        <LocaleChanger/>
      </div>
      
      <el-dialog
        v-model="dialogVisible"        
        width="400"
        :title="t('header.choose_format')"
      >
        <div>          
          <el-radio-group v-model="imageFormat">
            <el-radio value="png" size="small" border>PNG</el-radio>
            <el-radio value="jpeg" size="small" border>JPEG</el-radio>
            <el-radio value="bmp" size="small" border>BMP</el-radio>
            <el-radio value="webp" size="small" border>WEBP</el-radio>
          </el-radio-group>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">
              {{ $t('header.cancel') }}
            </el-button>
            <el-button type="primary" @click="saveImage">
              {{ $t('header.save') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
          
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
