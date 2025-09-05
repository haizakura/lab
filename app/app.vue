<template>
  <div class="app">
    <el-header class="header" role="banner">
      <BaseHeader />
    </el-header>

    <el-main class="main" role="main">
      <NuxtPage />
    </el-main>

    <el-footer class="footer" role="contentinfo">
      <BaseFooter />
    </el-footer>
  </div>

  <Analytics />
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';

const { locale } = useI18n();
useHead({
  htmlAttrs: {
    lang: locale,
  },
});
</script>
