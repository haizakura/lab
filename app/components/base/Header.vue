<template>
  <div class="header-container">
    <div class="header-left">
      <span @click="goBackHome">HAIZAKURA Lab</span>
    </div>

    <div class="header-right">
      <div class="mr-4">
        <BaseHeaderSearchBox />
      </div>

      <div>
        <BaseHeaderTranslate />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/');
  route ? navigateTo(route) : navigateTo('/');
};
</script>
