<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCanvasStore } from '~/store/canvasStore'
import MaterialSymbolsHelp from '~icons/material-symbols/help';

const canvasStore = useCanvasStore();

const pageWidth = ref(0)
const pageHeight = ref(0)
const hasMagicResize = ref(true)

onMounted(async () => {
  
  pageWidth.value = canvasStore.pageWidth
  pageHeight.value = canvasStore.pageHeight
 
});
</script>

<template>
  <div class="p-3">
    <div style="display:flex">
      <div class="mt-1">
        <span>{{ $t('resize.width') }}:</span>
      </div>
      <div class="flex-grow"/>
      <div>
        <el-input-number v-model="pageWidth" :min="1"   controls-position="right"  />
      </div>
    </div>
    <div class="mt-3" style="display:flex">
      <div class="mt-1">
        <span>{{ $t('resize.height') }}:</span>
      </div>
      <div class="flex-grow"/>
      <div>
        <el-input-number v-model="pageHeight" :min="1"   controls-position="right"  />
      </div>
    </div>
    <div class="mt-3">
      <div style="display:flex">
        <div class="mt-2" style="font-size: 14px; display:flex">
          <div>
            {{ $t('resize.use_magic_resize') }} 
          </div>
          <div class="icon-help">
            <el-tooltip :content="$t('resize.magic_resize')"   placement="bottom-end" effect="light">
              <MaterialSymbolsHelp/>
            </el-tooltip>
          </div>          
        </div>
        <div class="flex-grow"/>
        <div>
          <el-switch v-model="hasMagicResize"  />
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.icon-help{
  margin-left: 5px;
  margin-top: 2px;    
}
</style>