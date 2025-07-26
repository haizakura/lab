<template>
  <div class="app">
    <el-header class="header">
      <AppHeader />
    </el-header>

    <el-main class="main">
      <NuxtPage />
    </el-main>

    <el-footer v-if="useAppFooter" class="footer">
      <AppFooter />
    </el-footer>
  </div>

  <Analytics/>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

const useAppFooter = false;
</script>
