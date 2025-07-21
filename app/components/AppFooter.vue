<template>
  <el-footer>
    <div class="footer-content">
      <el-text>© {{ year }} HAIZAKURA Lab. All rights reserved.</el-text>
    </div>
  </el-footer>

  <!-- <el-footer class="fixed-bottom-center"> -->
    <!-- <a href="https://ipw.cn/ipv6webcheck/?site=lab.nya.run" title="本站支持IPv6访问" target="_blank"> -->
      <!-- <img class="ipv6-badge" alt="本站支持IPv6访问" src="https://static.ipw.cn/icon/ipv6-certified-lite-s4.svg"> -->
    <!-- </a> -->
  <!-- </el-footer> -->
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
// .ipv6-badge {
//   display: inline-block;
//   vertical-align: middle;
// }
</style>
