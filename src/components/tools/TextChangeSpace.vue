<script setup lang="ts">
import { useCanvasStore } from "~/store/canvasStore";
import { useI18n } from 'vue-i18n';
import { ref, unref, watch } from "vue";
import { ClickOutside as vClickOutside } from 'element-plus'
import GgFormatLineHeight from '~icons/gg/format-line-height';

const { t } = useI18n();
const canvasStore = useCanvasStore();

const buttonRefChangeSpace = ref()


const popoverRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const handleChangeLineHeight = () =>{
  canvasStore.changeLineHeight(canvasStore.selectedLineHeight/10)
}

const handleLetterSpace = () =>{
  canvasStore.changeLetterSpacing(canvasStore.selectedLetterSpace)
}

watch(
  () => canvasStore.selectedLineHeight,
  (newVal, oldVal) => {
    handleChangeLineHeight();
  }
);

watch(
  () => canvasStore.selectedLetterSpace,
  (newVal, oldVal) => {
    handleLetterSpace();
  }
);



</script>

<template>
  <div class="text-change-space">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="t('menu_header.change_space')"
      placement="bottom"
    >
      <el-button :disabled="!canvasStore.isThisObjectSelected" ref="buttonRefChangeSpace" v-click-outside="onClickOutside">
        <GgFormatLineHeight/>
      </el-button>
    </el-tooltip>
  
    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRefChangeSpace"
      trigger="click"            
      virtual-triggering
      width="300"
    >
      <div>
        <div class="slider-block">
          <span>{{$t('menu_header.line_height')}}</span>
          <el-slider v-model="canvasStore.selectedLineHeight" show-input :min="5" :max="200"  size="small"/>
        </div>
        <div>
          <span>{{$t('menu_header.letter_space')}}</span>
          <el-slider v-model="canvasStore.selectedLetterSpace" show-input :min="0" :max="500"  size="small"/>
        </div>
      </div>
    </el-popover>
  </div>
</template>



<style scoped>
.text-change-space{
  margin-left: 5px;
}

.ep-button{
  padding: 0px 5px;
}
</style>