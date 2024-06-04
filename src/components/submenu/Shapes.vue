<script setup lang="ts">
import square from '~/assets/shapes/square.svg'
import circle from '~/assets/shapes/circle.svg'
import triangle from '~/assets/shapes/triangle.svg'
import pentagram from '~/assets/shapes/pentagram.svg'
import hexagram from '~/assets/shapes/hexagram.svg'
</script>

<template>
  <div class="shapes">
    <span class="title-shape">{{$t('shapes.lines')}}</span>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="8">        
        <svg class="line" height="10" width="80">
          <line x1="0" y1="5" x2="100" y2="5" style="stroke:white;stroke-width:2" />
        </svg>
      </el-col>
      <el-col :span="8">
        <svg height="10" width="80">
          <line x1="0" y1="5" x2="100" y2="5" style="stroke:white;stroke-width:2;stroke-dasharray:5,5" />
        </svg>
      </el-col>
      <el-col :span="8">
        <svg height="10" width="80">
          <line x1="0" y1="5" x2="100" y2="5" style="stroke:white;stroke-width:2;stroke-dasharray:1,5" />
        </svg>
      </el-col>
      <el-col :span="8">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40">
          <path
            stroke="#ffffff"
            stroke-width="3"
            d="M 62.5 15 L 72.5 20 L 62.5 25"
            fill="none"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
          <path
            stroke="#ffffff"
            stroke-width="2"
            d="M 2.5 20 L 72.5 20"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
        </svg>
        
        
      </el-col>
      <el-col :span="8">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40">
          <path
            stroke="#fff"
            stroke-width="4"
            d="M 65 15 L 75 20 L 65 25 Z"
            fill="#fff"
          ></path>
          <path
            stroke="#fff"
            stroke-width="2"          
            d="M 2.5 20 L 72.5 20"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
          <circle cx="5" cy="20" r="5" fill="currentColor"></circle>
        </svg>
        
      </el-col>
      <el-col :span="8">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40">
          <!-- Quadrado à esquerda -->
          <rect  x="1" fill="currentColor" height="15" width="15" y="12"></rect>
          <!-- Linha tracejada -->
          <path data-v-e2b8f525="" stroke="currentColor" stroke-dasharray="2 1" stroke-width="2" d="M 15 20 H 80"></path>
          <!-- Segmento vertical -->
          <line x1="79" y1="12" x2="79" y2="28" stroke="currentColor" stroke-width="2"></line>
        </svg>
        
        
      </el-col>
      
    </el-row>
    <span class="title-shape">{{$t('shapes.shapes')}}</span>
    <el-row style="margin-top: 10px">
      <el-col :span="6">
        <img :src="square" class="filterit">
      </el-col>
      <el-col :span="6">
        <img :src="circle" class="filterit">    
      </el-col>
      <el-col :span="6">
        <img :src="triangle" class="filterit">  
      </el-col>
      <el-col :span="6">
        <img :src="pentagram" class="filterit">  
      </el-col>
      <el-col :span="6">
        <img :src="hexagram" class="filterit">
      </el-col>
      <el-col :span="6">
       
      </el-col>
      <el-col :span="6">
               
      </el-col>
    </el-row>
    
  </div>
</template>


<style scoped>
.shapes{
  padding: 10px;
}

.ep-col {
  margin-bottom: 20px;
}

.title-shape{
  font-size: 12px;
  font-weight: 600;
}

.filterit {
  filter: invert(100%);
}

</style>