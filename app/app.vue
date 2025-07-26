<template>
  <div class="app">
    <el-header class="header">
      <BaseHeader />
    </el-header>

    <el-main class="main">
      <NuxtPage />
    </el-main>
  </div>

  <Analytics/>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
</script>
