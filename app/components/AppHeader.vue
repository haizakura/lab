<template>
  <div class="header-container">
    <div class="header-title">
      <span @click="goBackHome">HAIZAKURA Lab</span>
    </div>
    
    <div class="header-language">
      <el-dropdown>
        <span>
          <MaterialSymbolsTranslateRounded class="header-language-icon" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="locale in availableLocales" :key="locale.code">
              <NuxtLink :to="switchLocalePath(locale.code)" class="header-language-link">{{ locale.name }}</NuxtLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

import MaterialSymbolsTranslateRounded from '@/components/MaterialSymbolsTranslateRounded.vue';

const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/');
  route ? navigateTo(route) : navigateTo('/');
};

const availableLocales = computed(() => locales.value);
</script>
