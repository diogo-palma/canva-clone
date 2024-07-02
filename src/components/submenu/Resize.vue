<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCanvasStore } from '~/store/canvasStore'
import MaterialSymbolsHelp from '~icons/material-symbols/help';
import MdiInstagram from '~icons/mdi/instagram';
import AntDesignFacebookOutlined from '~icons/ant-design/facebook-outlined';
import AntDesignYoutubeOutlined from '~icons/ant-design/youtube-outlined';
import MaterialSymbolsFullHd from '~icons/material-symbols/full-hd';
import QuillPaper from '~icons/quill/paper';
import PrimeIdCard from '~icons/prime/id-card';

const canvasStore = useCanvasStore();

const pageWidth = ref(0)
const pageHeight = ref(0)
const hasMagicResize = ref(true)

onMounted(async () => {
  
  pageWidth.value = canvasStore.pageWidth
  pageHeight.value = canvasStore.pageHeight
 
});

const resizeCanvas = (width: number, height: number) =>{
  pageWidth.value = width
  pageHeight.value = height
  canvasStore.resizeCanvas(width, height, hasMagicResize.value)
}
</script>

<template>
  <div class="p-3">
    <div style="display:flex">
      <div class="mt-1">
        <span>{{ $t('resize.width') }}:</span>
      </div>
      <div class="flex-grow"/>
      <div>
        <el-input-number v-model="pageWidth" :min="5" :max="10000"   controls-position="right"  />
      </div>
    </div>
    <div class="mt-3" style="display:flex">
      <div class="mt-1">
        <span>{{ $t('resize.height') }}:</span>
      </div>
      <div class="flex-grow"/>
      <div>
        <el-input-number v-model="pageHeight" :min="5" :max="10000"   controls-position="right"  />
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
    <div class="mt-2" style="display: flex; justify-content: center;">
      <el-button color="#1da1d2" @click="resizeCanvas(pageWidth, pageHeight)" class="btn-actions">{{ $t('resize.resize') }}</el-button>
    </div>
    <div class="mt-3 resize-template" @click="resizeCanvas(1080,1080)">
      <div style="margin-top:2px">
        <MdiInstagram/>
      </div>
      <div class="ml-1">
        Instagram Post
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        1080 x 1080 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(1080,1920)">
      <div style="margin-top:2px">
        <MdiInstagram/>
      </div>
      <div class="ml-1">
        Instagram Story
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        1080 x 1920 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(940,788)">
      <div style="margin-top:2px">
        <AntDesignFacebookOutlined/>
      </div>
      <div class="ml-1">
        Facebook Post
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        940 x 788 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(851,315)">
      <div style="margin-top:2px">
        <AntDesignFacebookOutlined/>
      </div>
      <div class="ml-1">
        Facebook Cover
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        851 x 315 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(1200,628)">
      <div style="margin-top:2px">
        <AntDesignFacebookOutlined/>
      </div>
      <div class="ml-1">
        Facebook Ad
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        1200 x 628 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(1280,720)">
      <div style="margin-top:2px">
        <AntDesignYoutubeOutlined/>
      </div>
      <div class="ml-1">
        Youtube Thumbnail
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        1280 x 720 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(2560,1440)">
      <div style="margin-top:2px">
        <AntDesignYoutubeOutlined/>
      </div>
      <div class="ml-1">
        Youtube Channel
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        2560 x 1440 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(1920,1080)">
      <div style="margin-top:2px">
        <MaterialSymbolsFullHd/>
      </div>
      <div class="ml-1">
        Full HD
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        1920 x 1080 px
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(529,529)">
      <div style="margin-top:2px">
        <QuillPaper/>
      </div>
      <div class="ml-1">
        {{ $t('resize.invitation') }}
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        14 x 14 cm
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(793,1122)">
      <div style="margin-top:2px">
        <QuillPaper/>
      </div>
      <div class="ml-1">
        A4
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        21 x 29.7 cm
      </div>
    </div>
    <div class="mt-1 resize-template" @click="resizeCanvas(336,192)">
      <div style="margin-top:2px">
        <PrimeIdCard/>
      </div>
      <div class="ml-1">
        {{ $t('resize.card') }}
      </div>
      <div class="flex-grow"/>
      <div class="mt-1" style="font-size: 12px">
        3.5 x 2 in
      </div>
    </div>
  </div>
</template>



<style scoped>
.icon-help{
  margin-left: 5px;
  margin-top: 2px;    
}

.resize-template{
  display:flex;
  padding: 4px;
  cursor: pointer;
  border-radius: 5px;
}
.resize-template:hover{
  background: #111;
}
</style>