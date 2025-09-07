<template>
  <div class="flex flex-row items-center justify-center text-sm gap-2">
    <span class="text-info">Copyright © {{ year }} HAIZAKURA</span>
    <span class="text-info">|</span>
    <NuxtLink
      to="https://github.com/haizakura/lab"
      target="_blank"
      class="underline underline-offset-3 hover:text-brand cursor-pointer"
      >GitHub</NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
