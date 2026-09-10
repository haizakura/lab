<template>
  <div class="app">
    <header class="header" role="banner">
      <BaseHeader />
    </header>

    <main class="main" role="main">
      <NuxtPage />
    </main>

    <footer class="footer" role="contentinfo">
      <BaseFooter />
    </footer>
  </div>

  <Toaster :theme="toasterTheme" />
</template>

<script setup lang="ts">
import 'vue-sonner/style.css';
import { Toaster } from '@/components/ui/sonner';

const { locale } = useI18n();
const colorMode = useColorMode();
const toasterTheme = computed(() => (colorMode.value === 'dark' ? ('dark' as const) : ('light' as const)));

useHead({
  htmlAttrs: {
    lang: locale,
  },
});
</script>
