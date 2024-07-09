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
import MageLockFill from '~icons/mage/lock-fill';
import { ClickOutside as vClickOutside } from 'element-plus'
import IconamoonMenuKebabVerticalBold from '~icons/iconamoon/menu-kebab-vertical-bold';
import PhCaretDown from '~icons/ph/caret-down';
import PhCaretUp from '~icons/ph/caret-up';
import IconParkOutlineDoubleUp from '~icons/icon-park-outline/double-up';
import IconParkOutlineDoubleDown from '~icons/icon-park-outline/double-down';
import PhAlignLeftFill from '~icons/ph/align-left-fill';
import PhAlignTopFill from '~icons/ph/align-top-fill';
import MingcuteAlignHorizontalCenterFill from '~icons/mingcute/align-horizontal-center-fill';
import MingcuteAlignVerticalCenterFill from '~icons/mingcute/align-vertical-center-fill';
import PhAlignRightFill from '~icons/ph/align-right-fill';
import PhAlignBottomFill from '~icons/ph/align-bottom-fill';
import IconParkOutlineGroup from '~icons/icon-park-outline/group';
import MdiUngroup from '~icons/mdi/ungroup';


const buttonRefPosition = ref()
const buttonRefMoreTools = ref()
const buttonRefTransparency = ref()

const popoverRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}


const popoverRefTransparency = ref()

const onClickOutsideTransparency = () => {
  unref(popoverRefTransparency).popperRef?.delayHide?.()
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
const sendToUp = () => {
  if (!canvasStore.selectedObjectAtFront)
    canvasStore.sendToUp()  
}

const sendToForward = () => {
  if (!canvasStore.selectedObjectAtFront)
    canvasStore.sendToForward()
}

const sendToDown = () => {
  if (!canvasStore.selectedObjectAtBack)
    canvasStore.sendToDown()  
}

const sendToBottom = () => {
  if (!canvasStore.selectedObjectAtBack)
    canvasStore.sendToBottom()
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

const getLock = computed(() => {
  return canvasStore.selectedLock ? t('menu_header.unlock') : t('menu_header.lock');
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
        <div  class="tools ml-2" v-show="canvasStore.isThisObjectSelected && !canvasStore.selectedLock" ref="tools" >
          <ColorPicker/>
          <TextFont/>
          <FontSize/>
          <TextAlign/>
          <TextBold/>
          <TextUnderline/>            
          <TextStrikeThrough/>
          <TextChangeSpace/>
          <EffectsTool/>
        </div>
        <div class="more-tools" v-show="canvasStore.isThisObjectSelected && hasMoreTools && canvasStore.selectedObjectType != 'groups'" >
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

          <el-button @click="canvasStore.groupObjects" v-if="canvasStore.selectedObjectType == 'groups' && canvasStore.isObjectSelected">
            <IconParkOutlineGroup/>
            <span>{{$t('menu_header.group')}}</span>
          </el-button>

          <el-button @click="canvasStore.ungroupObjects" v-if="canvasStore.selectedObjectType == 'group' && canvasStore.isObjectSelected">
            <MdiUngroup/>
            <span>{{$t('menu_header.ungroup')}}</span>
          </el-button>
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
            :width="240"
          >
            <div>
              <span class="title_position">{{$t('menu_header.layering')}}</span>
              <div class="mt-2" style="display: flex" >
                <div style="display: flex" @click="sendToUp"   
                  :class="[
                    canvasStore.selectedObjectAtFront ? 'disabled-menu': 'menu-position',
                            canvasStore.selectedObjectType === 'groups' ? 'disabled-menu' : 'menu-position'
                  ]"
                >
                  <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                    <PhCaretUp/>
                  </div>
                  <div>
                    {{ $t('menu_header.up') }}
                  </div>                  
                </div>
                <div class="flex-grow"/>
                <div style="display: flex" @click="sendToDown" 
                :class="[
                  canvasStore.selectedObjectAtBack ? 'disabled-menu': 'menu-position',
                          canvasStore.selectedObjectType === 'groups' ? 'disabled-menu' : 'menu-position'
                ]">
                  <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                    <PhCaretDown/>
                  </div>
                  <div>
                    {{ $t('menu_header.down') }}
                  </div>                  
                </div>
              </div>
              <div class="mt-2" style="display: flex" >
                <div  style="display: flex" @click="sendToForward" 
                  :class="[
                    canvasStore.selectedObjectAtFront ? 'disabled-menu': 'menu-position' ,
                            canvasStore.selectedObjectType === 'groups' ? 'disabled-menu' : 'menu-position'
                  ]">
                  <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                    <IconParkOutlineDoubleUp/>
                  </div>
                  <div>
                    {{ $t('menu_header.to_forward') }}
                  </div>                  
                </div>
                <div class="flex-grow"/>
                <div style="display: flex" @click="sendToBottom" 
                  :class="[
                    canvasStore.selectedObjectAtBack ? 'disabled-menu': 'menu-position' ,
                            canvasStore.selectedObjectType === 'groups' ? 'disabled-menu' : 'menu-position'
                  ]">
                  <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                    <IconParkOutlineDoubleDown/>
                  </div>
                  <div>
                    {{ $t('menu_header.to_bottom') }}
                  </div>                  
                </div>

              </div>          
              <div v-if="!canvasStore.selectedLock">
                <el-divider style="margin: 10px 0px" />     
                <span class="title_position">{{$t('menu_header.position')}}</span>
                <div   class="mt-2" style="display: flex">
                  <div class="menu-position" @click="canvasStore.alignLeft" style="display: flex">
                    <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                      <PhAlignLeftFill/>
                    </div>
                    <div>
                      {{ $t('menu_header.align_left') }}
                    </div>                  
                  </div>
                  <div class="flex-grow"/>
                  <div class="menu-position" @click="canvasStore.alignTop"  style="display: flex">
                    <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                      <PhAlignTopFill/>
                    </div>
                    <div>
                      {{ $t('menu_header.align_top') }}
                    </div>                  
                  </div>
  
                </div>  
                <div class="mt-2" style="display: flex">
                  <div class="menu-position" @click="canvasStore.alignCenter" style="display: flex">
                    <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                      <MingcuteAlignHorizontalCenterFill/>
                    </div>
                    <div>
                      {{ $t('menu_header.align_center') }}
                    </div>                  
                  </div>
                  <div class="flex-grow"/>
                  <div class="menu-position" @click="canvasStore.alignMiddle"  style="display: flex">
                    <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                      <MingcuteAlignVerticalCenterFill/>
                    </div>
                    <div>
                      {{ $t('menu_header.align_middle') }}
                    </div>                  
                  </div>
  
                </div> 
                <div class="mt-2" style="display: flex">
                  <div class="menu-position" @click="canvasStore.alignRight"   style="display: flex">
                    <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                      <PhAlignRightFill/>
                    </div>
                    <div>
                      {{ $t('menu_header.align_right') }}
                    </div>                  
                  </div>
                  <div class="flex-grow"/>
                  <div class="menu-position" @click="canvasStore.alignBottom"  style="display: flex">
                    <div style="margin-top: 3px;font-size: 12px;margin-right: 3px;">
                      <PhAlignBottomFill/>
                    </div>
                    <div>
                      {{ $t('menu_header.align_bottom') }}
                    </div>                  
                  </div>
  
                </div>  
              </div>             
             
            </div>
          </el-popover>

          <el-tooltip
              class="box-item"
              effect="dark"
              :content="t('menu_header.transparency')"
              placement="bottom"
            >
            <el-button style="padding: 0px 10px;" ref="buttonRefTransparency" :disabled="!canvasStore.isThisObjectSelected || canvasStore.selectedLock">
              <BiTransparency/>
            </el-button>
          </el-tooltip>

          <el-popover
            ref="popoverRefTransparency"
            :virtual-ref="buttonRefTransparency"
            trigger="click"            
            virtual-triggering
            :width="240"
          >
            <div style="text-align: center;">
              <span style="font-size: 13px">{{ t('menu_header.transparency') }}</span>
              <div style="display: flex">
                <div style="width: 230px">
                  <el-slider v-model="canvasStore.selectedOpacity" @input="canvasStore.changeTransparency"  :show-tooltip="false" :min="0" :max="100"  />
                </div>
                <div>
                  <el-input-number v-model="canvasStore.selectedOpacity" size="small" :min="0" :max="100"  controls-position="right"  />
                </div>
              </div>
              
            </div>  
          </el-popover>

          <el-tooltip
            class="box-item"
            effect="dark"
            :content="getLock"
            placement="bottom"
          >
            <el-button @click="canvasStore.changeLock" style="padding: 0px 10px;" :disabled="!canvasStore.isThisObjectSelected">
              <MageUnlockedFill v-if="!canvasStore.selectedLock"/>
              <MageLockFill v-else/>
            </el-button>
          </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="t('menu_header.duplicate')"
          placement="bottom"
        >
          <el-button @click="canvasStore.duplicateObject" :disabled="!canvasStore.isThisObjectSelected || canvasStore.selectedLock">
            <PepiconsPencilDuplicate style="font-size: 22px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="t('menu_header.remove')"
          placement="bottom"
        >
          <el-button @click="canvasStore.removeObject" :disabled="!canvasStore.isThisObjectSelected || canvasStore.selectedLock">
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
  font-weight: 700;
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

.menu-position{
  padding: 4px;
  cursor: pointer;
}
.menu-position:hover{
  background: #ccc
}

.disabled-menu{
  padding: 4px;
  cursor: not-allowed;
  color: #ccc;
}
.ep-input-number--small{
  width: 75px;
}




</style>