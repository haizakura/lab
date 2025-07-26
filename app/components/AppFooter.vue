<template>
    <div>
      <el-text>© {{ year }} HAIZAKURA Lab. All rights reserved.</el-text>
    </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
