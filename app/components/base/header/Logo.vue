<template>
  <span class="text-primary" @click="goBackHome" aria-label="HAIZAKURA Lab">HAIZAKURA Lab</span>
</template>

<script lang="ts" setup>
const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/') ?? '/';
  navigateTo(route);
};
</script>
