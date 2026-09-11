<template>
  <div class="page flex-col gap-4">
    <h1 class="mt-4 text-8xl font-semibold text-foreground">
      <WrenchIcon class="size-24" aria-hidden="true" />
    </h1>
    <h2 class="text-3xl font-semibold text-foreground">
      {{ $t('Under Development') }}
    </h2>
    <NuxtLink
      class="cursor-pointer text-sm font-medium underline underline-offset-3 hover:text-foreground"
      @click="goBackHome"
      :aria-label="$t('Go back home')"
      >{{ $t('Go back home') }}</NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
import { WrenchIcon } from '@lucide/vue';

definePageMeta({
  name: 'underDevelopment',
});

const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute({ name: 'home' });
  navigateTo(route);
};
</script>
