<template>
  <div class="page flex-col">
    <h1 class="font-semibold text-8xl text-primary my-4">
      <Icon name="mdi:tools" />
    </h1>
    <h2 class="font-semibold text-3xl text-primary mb-4">
      {{ $t('Under Development') }}
    </h2>
    <div class="flex items-center justify-center w-full">
      <NuxtLink
        class="font-medium hover:text-brand text-sm underline underline-offset-3 cursor-pointer"
        @click="goBackHome"
        :aria-label="$t('Go back home')"
        >{{ $t('Go back home') }}</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'underDevelopment',
});

const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/') ?? '/';
  navigateTo(route);
};
</script>
