<template>
  <div class="app-container">
    <el-header class="header">
      <AppHeader />
    </el-header>

    <el-main class="main">
      <NuxtPage />
    </el-main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';
</script>
