<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CircleFlagsBr from '~icons/circle-flags/br';
import CircleFlagsUs from '~icons/circle-flags/us';

const { availableLocales, locale } = useI18n();


const flagIcons = {
  en: CircleFlagsUs,
  pt_BR: CircleFlagsBr
};

const changeLocale = (loc: string) => {
  locale.value = loc;
};

const languageNames = {
  en: 'English',
  pt_BR: 'Português (Brasil)'
};

</script>

<template>  
  <div class="locale-changer">
    <el-dropdown>
      <span class="el-dropdown-link">
        <component :is="flagIcons[locale]" class="flag-icon" />
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="(name, loc) in languageNames" 
            :key="loc" 
            :command="loc"
            @click="changeLocale(loc)"
          >
            <component :is="flagIcons[loc]" class="flag-icon" />
            {{ name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  
</template>

<style scoped>
.locale-changer {
  display: flex;
  align-items: center;
  width: 50px;
}

.flag-icon {  
  width: 22px;
  height: 22px;
  vertical-align: middle;
}
</style>
