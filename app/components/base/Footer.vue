<template>
  <el-text type="info">Copyright © {{ year }} HAIZAKURA</el-text>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
