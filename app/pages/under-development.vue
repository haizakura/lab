<template>
  <div class="page flex-col">
    <h1 class="font-semibold text-8xl text-primary my-4">
      <IconsTools />
    </h1>
    <h2 class="font-semibold text-3xl text-primary mb-4">{{ $t('Under Development') }}</h2>
    <div class="flex items-center justify-center w-full">
      <NuxtLink
      class="font-medium hover:text-brand text-sm underline underline-offset-3 cursor-pointer"
      @click="goBackHome"
    >{{ $t('Go back home') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'underDevelopment',
});

const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/');
  route ? navigateTo(route) : navigateTo('/');
};
</script>
