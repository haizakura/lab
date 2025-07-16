<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>

  <SpeedInsights />
  <Analytics />
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { Analytics } from '@vercel/analytics/nuxt';
</script>
