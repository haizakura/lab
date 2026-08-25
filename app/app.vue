<template>
  <UApp>
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
  </UApp>
</template>

<script setup lang="ts">
const { locale } = useI18n();
useHead({
  htmlAttrs: {
    lang: locale,
  },
});
</script>
