<template>
  <el-card shadow="always" class="card">
    <template #header>
      <div class="card-header">
        <el-text tag="b" size="large" class="card-header-title" @click="goTo(name)">{{ title }}</el-text>
      </div>
    </template>
    <div class="card-body mb-8">
      <el-text line-clamp="2">{{ desc }}</el-text>
    </div>
    <div class="card-bottom mt-16">
      <el-link :href="path" underline="never">
        <el-text type="info" size="small">{{ currentUrl + path }}</el-text>
      </el-link>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: String,
  name: String,
  path: String,
  desc: String,
});

const router = useRouter();

const currentUrl = 'https://lab.nya.run';

const goTo = (name: string | undefined) => {
  name && router.push({ name });
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.card-header-title {
  color: #000;
}

.card-body {
  line-height: 1.55;
  min-height: 3.1rem;
  text-decoration: none;
}

.card-bottom {
  line-height: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
</style>
