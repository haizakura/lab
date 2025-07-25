<template>
  <div class="header-container">
    <el-text tag="b" class="lab-title" @click="goBackHome">HAIZAKURA Lab</el-text>
    
    <div class="header-right">
      <el-dropdown>
        <span>
          <MaterialSymbolsTranslateRounded class="language-icon" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="locale in availableLocales" :key="locale.code">
              <NuxtLink :to="switchLocalePath(locale.code)" class="language-link">{{ locale.name }}</NuxtLink>
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

<style lang="css" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.lab-title {
  cursor: pointer;
  color: #000;
  font-size: 1.2rem;
  text-decoration: none;
  line-height: 3rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.language-icon {
  font-size: 2rem;
  line-height: 3rem;
  cursor: pointer;
}

.language-link {
  color: #000;
  text-decoration: none;
}
</style>
