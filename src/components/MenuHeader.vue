<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import SolarUndoLeftRoundBroken from '~icons/solar/undo-left-round-broken';
import SolarUndoRightRoundBroken from '~icons/solar/undo-right-round-broken';
import { useCanvasStore } from '~/store/canvasStore';
import MingcuteLayerLine from '~icons/mingcute/layer-line';
import BiTransparency from '~icons/bi/transparency';
import PepiconsPencilDuplicate from '~icons/pepicons-pencil/duplicate';
import BasilTrashOutline from '~icons/basil/trash-outline';
import MageUnlockedFill from '~icons/mage/unlocked-fill';
import { ClickOutside as vClickOutside } from 'element-plus'
import IconamoonMenuKebabVerticalBold from '~icons/iconamoon/menu-kebab-vertical-bold';


const buttonRefPosition = ref()
const buttonRefMoreTools = ref()

const popoverRef = ref()

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

const tools = ref(null);
const moreTools = ref(null);
const toolsRight = ref(null)
const hasMoreTools = ref(false)
const menuHeader = ref(null);
const lastWindowWidth = ref(null)


const handleResize = () => {
  const toolsPosition = tools.value.getBoundingClientRect();
  const toolsRoghtPosition = toolsRight.value.getBoundingClientRect();
  const currentWindowWidth = menuHeader.value.clientWidth;

  if (toolsPosition.right + 100 >= toolsRoghtPosition.left && currentWindowWidth < lastWindowWidth.value) {
    const toolComponents = Array.from(tools.value.children);
    const componentToMove = toolComponents.pop(); 
    if (componentToMove) {
      hasMoreTools.value = true;
      // moreTools.value.appendChild(componentToMove);
      moreTools.value.insertAdjacentElement('afterbegin', componentToMove)      
    }
  } else if (currentWindowWidth > lastWindowWidth.value && toolsPosition.right + 100 <= toolsRoghtPosition.left) {
    const moreToolComponents = Array.from(moreTools.value.children);
    const componentToMoveBack = moreToolComponents.shift();
    if (componentToMoveBack) {
      tools.value.appendChild(componentToMoveBack);
    }
  }
  lastWindowWidth.value = menuHeader.value.clientWidth;

  hasMoreTools.value = moreTools.value?.children.length > 0;
};


const handleMoreTools = () => {
  
  const toolsPosition = tools.value.getBoundingClientRect();
  const toolsRoghtPosition = toolsRight.value.getBoundingClientRect();

  if (toolsPosition.right + 100 >= toolsRoghtPosition.left){
    const toolComponents = Array.from(tools.value.children);
    const componentToMove = toolComponents.pop(); 
    if (componentToMove) {
      hasMoreTools.value = true;
      // moreTools.value.appendChild(componentToMove);
      moreTools.value.insertAdjacentElement('afterbegin', componentToMove)      
    }
    if (toolsPosition.right + 100 >= toolsRoghtPosition.left)
      handleMoreTools()
  }

}

 
onMounted(() => {
  if (menuHeader.value) {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(menuHeader.value);
    
    lastWindowWidth.value = menuHeader.value.clientWidth
    onUnmounted(() => {
      resizeObserver.unobserve(menuHeader.value);
    });
  }
});


watch(
  () => canvasStore.isThisObjectSelected,
  (newVal, oldVal) => {
    setTimeout(() => {
      handleMoreTools();  
    }, 100);
    
  }
);


</script>

<template>
  <el-row>
    <el-col :span="24">
      <div class="menu-header" ref="menuHeader">
        <div class="" >
          <el-button circle :disabled="!canvasStore.canUndo" @click="undo"><SolarUndoLeftRoundBroken /></el-button>
          <el-button circle :disabled="!canvasStore.canRedo" @click="redo"><SolarUndoRightRoundBroken /></el-button>
          
        </div>
        <div  class="tools ml-2" v-show="canvasStore.isThisObjectSelected" ref="tools" >
          <ColorPicker/>
          <TextFont/>
          <FontSize/>
          <TextAlign/>
          <TextBold/>
          <TextUnderline/>            
          <TextStrikeThrough/>
          <TextChangeSpace/>
          <EffectsTool/>
          <AnimationsTool/>
        </div>
        <div class="more-tools" v-show="canvasStore.isThisObjectSelected && hasMoreTools" >
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="t('menu_header.more_tools')"
            placement="bottom"
          >
            <el-button :disabled="!canvasStore.isThisObjectSelected" ref="buttonRefMoreTools" v-click-outside="onClickOutside">
              <IconamoonMenuKebabVerticalBold/>
            </el-button>
          </el-tooltip>
        
          <el-popover
            ref="popoverRef"
            :virtual-ref="buttonRefMoreTools"
            trigger="click"            
            virtual-triggering
            :width="200"
          >
            <div ref="moreTools" class="more-tools-content" style="">
              
            </div>
          </el-popover>
        </div>
        
        <div class="flex-grow" />
        <div class="tools-right" ref="toolsRight">
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
.ep-button + .ep-button {
  margin-left: 5px;
}

:deep(.text-select) {
  background-color: #dfdfdf;
  box-shadow: 1px 1px 1px #a8a8a8;
}

.more-tools{
  margin-left: 5px;
}

.more-tools-content{
  display: flex;
  flex-flow: wrap;
}
.more-tools-content > div{
  margin: 4px;
}




</style>