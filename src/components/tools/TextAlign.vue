<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';
import GgFormatCenter from '~icons/gg/format-center';
import GgFormatLeft from '~icons/gg/format-left';
import GgFormatRight from '~icons/gg/format-right';
import GgFormatJustify from '~icons/gg/format-justify';
import { watch } from "vue";

const { t } = useI18n();
const canvasStore = useCanvasStore();

function getAlignmentIcon(textAlign) {
  switch (textAlign) {
    case 'center':
      return GgFormatCenter;
    case 'left':
      return GgFormatLeft;
    case 'right':
      return GgFormatRight;
    case 'justify':
      return GgFormatJustify;
    default:
      return GgFormatCenter; 
  }
}

function getTooltipContent(textAlign) {  
  switch (textAlign) {
    case 'center':
      return t('menu_header.center');
    case 'left':
      return t('menu_header.left');
    case 'right':
      return t('menu_header.right');
    case 'justify':
      return t('menu_header.justify');
    default:
      return t('menu_header.center'); 
  }
}

function changeTextAlign() {
  const alignments = ['left', 'center', 'right', 'justify'];
  const currentIndex = alignments.indexOf(canvasStore.selectedTextAlign);
  const nextIndex = (currentIndex + 1) % alignments.length; 
  const nextAlign = alignments[nextIndex];

  canvasStore.changeTextAlign(nextAlign)    
}

watch(
  () => canvasStore.selectedTextAlign,
  (newVal, oldVal) => {
    console.log(newVal)
    if (newVal){
      getAlignmentIcon(newVal)
      getTooltipContent(newVal)
    }
  }
);
</script>

<template>
  <div class="text-align">
    <el-tooltip
      v-if="canvasStore.isThisObjectSelected"
      class="box-item"
      effect="dark"
      :content="getTooltipContent(canvasStore.selectedTextAlign)"
      placement="bottom"
    >
      <el-button style="padding: 0px 10px;" @click="changeTextAlign">
        <component :is="getAlignmentIcon(canvasStore.selectedTextAlign)" />
      </el-button>
    </el-tooltip>
  </div>
</template>



<style scoped>
.text-align{
  margin-left: 5px;
}
</style>