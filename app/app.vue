<template>
  <div class="app">
    <el-header class="header">
      <AppHeader />
    </el-header>

    <el-main class="main">
      <NuxtPage />
    </el-main>
  </div>

  <Analytics/>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import AppHeader from '@/components/AppHeader.vue';
</script>
