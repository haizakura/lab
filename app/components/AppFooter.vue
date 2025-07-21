<template>
  <el-footer>
    <div class="footer-content">
      <el-text>© {{ year }} HAIZAKURA Lab. All rights reserved.</el-text>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
