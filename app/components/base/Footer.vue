<template>
  <div class="flex flex-row items-center justify-center gap-2 text-sm">
    <span class="text-muted-foreground">Copyright © {{ year }} HAIZAKURA</span>
    <span class="text-muted-foreground">|</span>
    <NuxtLink
      to="https://github.com/haizakura/lab"
      target="_blank"
      class="cursor-pointer underline underline-offset-3 hover:text-foreground"
      >GitHub</NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
