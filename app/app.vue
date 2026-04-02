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
</template>

<script setup lang="ts">
const { locale } = useI18n();
useHead({
  htmlAttrs: {
    lang: locale,
  },
});
</script>
