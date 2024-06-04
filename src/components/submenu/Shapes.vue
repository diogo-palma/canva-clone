<script setup lang="ts">

</script>

<template>
  <div class="shapes">
    <span>{{$t('shapes.lines')}}</span>
    <el-row :gutter="20">
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
            stroke="currentColor"
            stroke-width="8"
            d="M 62.5 15 L 72.5 20 L 62.5 25"
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
    </el-row>
    
  </div>
</template>


<style scoped>
.shapes{
  padding: 10px;
}

</style>