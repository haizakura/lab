<template>
  <el-text tag="b" class="lab-title" @click="goBackHome">HAIZAKURA Lab</el-text>
</template>

<script lang="ts" setup>
const router = useRouter();

const goBackHome = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.lab-title {
  cursor: pointer;
  color: #000;
  font-size: 1.2rem;
  text-decoration: none;
  line-height: 3rem;
}
</style>
