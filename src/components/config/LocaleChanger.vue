<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown } from '@element-plus/icons-vue'
import CircleFlagsBr from '~icons/circle-flags/br';
import CircleFlagsUs from '~icons/circle-flags/us';
import CircleFlagsDe from '~icons/circle-flags/de';
import CircleFlagsFr from '~icons/circle-flags/fr';
import CircleFlagsIt from '~icons/circle-flags/it';
import CircleFlagsEs from '~icons/circle-flags/es';
import CircleFlagsJa from '~icons/circle-flags/ja';
import CircleFlagsRu from '~icons/circle-flags/ru';
import CircleFlagsSa from '~icons/circle-flags/sa';
import CircleFlagsCn from '~icons/circle-flags/cn';

const { availableLocales, locale } = useI18n();


const flagIcons = {
  en: CircleFlagsUs,
  pt_BR: CircleFlagsBr,
  de: CircleFlagsDe,
  fr: CircleFlagsFr,
  it: CircleFlagsIt,
  es: CircleFlagsEs,
  ja: CircleFlagsJa,
  ru: CircleFlagsRu,
  sa: CircleFlagsSa,
  cn: CircleFlagsCn,
};

const changeLocale = (loc: string) => {
  locale.value = loc;
  localStorage.setItem('locale', loc);
};

const languageNames = {
  en: 'English',
  pt_BR: 'Português (Brasil)',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  ja: '日本語',
  ru: 'Русский',
  sa: 'العربية',
  cn: '中文',
};

onMounted(() => {
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale && availableLocales.includes(savedLocale)) {
    locale.value = savedLocale;
  }
});

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
