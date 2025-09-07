<template>
  <div class="page flex-col gap-4">
    <h1 class="font-semibold text-8xl text-primary mt-4">
      <Icon name="mdi:tools" />
    </h1>
    <h2 class="font-semibold text-3xl text-primary">
      {{ $t('Under Development') }}
    </h2>
    <NuxtLink
      class="font-medium hover:text-brand text-sm underline underline-offset-3 cursor-pointer"
      @click="goBackHome"
      :aria-label="$t('Go back home')"
      >{{ $t('Go back home') }}</NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'underDevelopment',
});

const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute({ name: 'home' });
  navigateTo(route);
};
</script>
