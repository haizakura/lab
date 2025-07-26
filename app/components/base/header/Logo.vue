<template>
  <span class="text-primary" @click="goBackHome">HAIZAKURA Lab</span>
</template>

<script lang="ts" setup>
const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/');
  route ? navigateTo(route) : navigateTo('/');
};
</script>
