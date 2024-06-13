<script setup lang="ts">
import { onMounted, ref, unref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import SolarUndoLeftRoundBroken from '~icons/solar/undo-left-round-broken';
import SolarUndoRightRoundBroken from '~icons/solar/undo-right-round-broken';
import { useCanvasStore } from '~/store/canvasStore';
import MingcuteLayerLine from '~icons/mingcute/layer-line';
import BiTransparency from '~icons/bi/transparency';
import PepiconsPencilDuplicate from '~icons/pepicons-pencil/duplicate';
import BasilTrashOutline from '~icons/basil/trash-outline';
import MageUnlockedFill from '~icons/mage/unlocked-fill';
import GgFormatCenter from '~icons/gg/format-center';
import GgFormatLeft from '~icons/gg/format-left';
import GgFormatRight from '~icons/gg/format-right';
import GgFormatJustify from '~icons/gg/format-justify';
import JamBold from '~icons/jam/bold';
import MingcuteUnderlineLine from '~icons/mingcute/underline-line';
import TablerItalic from '~icons/tabler/italic';
import RadixIconsStrikethrough from '~icons/radix-icons/strikethrough';
import GgFormatLineHeight from '~icons/gg/format-line-height';
import { ClickOutside as vClickOutside } from 'element-plus'


const buttonRefPosition = ref()

const popoverRef = ref()
const buttonRefChangeSpace = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const { t } = useI18n();


const canvasStore = useCanvasStore();

const undo = () => {
  canvasStore.undo();
};

const redo = () => {
  canvasStore.redo();
};



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

const handleChangeFontSize = () =>{
  canvasStore.changeFontSize(canvasStore.fontSize)
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
  <el-row>
    <el-col :span="24">
      <div class="menu-header">
        <div class="" >
          <el-button circle :disabled="!canvasStore.canUndo" @click="undo"><SolarUndoLeftRoundBroken /></el-button>
          <el-button circle :disabled="!canvasStore.canRedo" @click="redo"><SolarUndoRightRoundBroken /></el-button>
          
        </div>
        <div  class="tools ml-2" v-if="canvasStore.isThisObjectSelected" >
          <ColorPicker/>
          <TextFont/>
          <div class="font-size">
            <el-input-number
              v-model="canvasStore.fontSize"
              :min="1"              
              controls-position="right"
              @change="handleChangeFontSize"
            />
          </div>
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
          <div class="text-bold">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('menu_header.bold')"
              placement="bottom"
            >
              <el-button @click="canvasStore.changeBold" style="padding: 0px 4px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextBold }">
                <JamBold style="font-size: 22px"/>
              </el-button>
            </el-tooltip>
          </div>
          <div class="text-italic">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('menu_header.italic')"
              placement="bottom"
            >
              <el-button @click="canvasStore.changeItalic" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextItalic }">
                <TablerItalic/>
              </el-button>
            </el-tooltip>
          </div>
          <div class="text-underline">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('menu_header.underline')"
              placement="bottom"
            >
              <el-button @click="canvasStore.changeUnderline" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextUnderline }">
                <MingcuteUnderlineLine/>
              </el-button>
            </el-tooltip>
          </div>
          <div class="text-strike">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('menu_header.strike_through')"
              placement="bottom"
            >
              <el-button @click="canvasStore.changeStrikethrough" style="padding: 0px 9px;" :disabled="!canvasStore.isThisObjectSelected" :class="{ 'text-select': canvasStore.selectedTextStrikethrough }">
                <RadixIconsStrikethrough/>
              </el-button>
            </el-tooltip>
          </div>
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
            >
              <div>
                
              </div>
            </el-popover>
          </div>
          
        </div>
        
        <div class="flex-grow" />
        <div class="tools-right">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('menu_header.change_position')"
            placement="bottom"
          >
            <el-button :disabled="!canvasStore.isThisObjectSelected" ref="buttonRefPosition" v-click-outside="onClickOutside">
              <MingcuteLayerLine/>
              <span>{{$t('menu_header.position')}}</span>
            </el-button>
          </el-tooltip>
        
          <el-popover
            ref="popoverRef"
            :virtual-ref="buttonRefPosition"
            trigger="click"            
            virtual-triggering
          >
            <div>
              <span class="title_position">{{$t('menu_header.layering')}}</span>
              <div>

              </div>
            </div>
          </el-popover>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('menu_header.transparency')"
            placement="bottom"
          >
            <el-button style="padding: 0px 10px;" :disabled="!canvasStore.isThisObjectSelected">
              <BiTransparency/>
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('menu_header.lock')"
            placement="bottom"
          >
            <el-button style="padding: 0px 10px;" :disabled="!canvasStore.isThisObjectSelected">
              <MageUnlockedFill/>
            </el-button>
          </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="t('menu_header.duplicate')"
          placement="bottom"
        >
          <el-button :disabled="!canvasStore.isThisObjectSelected">
            <PepiconsPencilDuplicate style="font-size: 22px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="t('menu_header.remove')"
          placement="bottom"
        >
          <el-button :disabled="!canvasStore.isThisObjectSelected">
            <BasilTrashOutline/>
          </el-button>
        </el-tooltip>
        </div>
      </div>
      
      
    </el-col>
  </el-row>
</template>

<style scoped>
.menu-header{
  display: flex;
  padding: 0px 20px;
  align-items: center;
  min-height: 7vh;
  box-shadow: var(--el-box-shadow);
  border-bottom: 1px solid #ccc;
}
.menu-select-object{
  display: flex;
  padding: 5px;
}
.ep-button{
  padding: 0px 5px;
}
.title_position{
  font-size: 12px;
  font-weight: 600;
}

.tools{
  display: flex;
}
.font-text{
  margin-left: 5px;
}
.recents-fonts{
  padding: 5px;
}
.recents-fonts:hover{
  background-color: var(--ep-fill-color-light)
}
.font-size{
  margin-left: 5px;  
}
.font-size > .ep-input-number{
  width: 80px;
}

.ep-button + .ep-button {
  margin-left: 5px;
}

.text-align{
  margin-left: 5px;
}
.text-bold{
  margin-left: 5px;
}
.text-select {
  background-color: #dfdfdf;
  box-shadow: 1px 1px 1px #a8a8a8;
}
.text-underline{
  margin-left: 5px;
}
.text-italic{
  margin-left: 5px;
}
.text-strike{
  margin-left: 5px;
}
.text-change-space{
  margin-left: 5px;
}

</style>