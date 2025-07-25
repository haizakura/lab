<template>
  <el-card shadow="always" class="card">
    <template #header>
      <div class="card-header">
        <el-text
          tag="b"
          size="large"
          class="card-header-title"
          @click="goTo(path as string)"
        >{{ $t(title as string) }}</el-text>
      </div>
    </template>
    <div class="card-body mb-2">
      <el-text line-clamp="2">{{ $t(desc as string) }}</el-text>
    </div>
    <div class="card-bottom">
      <el-text class="card-bottom-link" type="info" size="small" @click="goTo(path as string)">{{ currentUrl + path }}</el-text>
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

const currentUrl = 'https://lab.nya.run';

const goTo = (path: string) => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute(path);
  route ? navigateTo(route) : navigateTo(path);
};
</script>

<style lang="css" scoped>
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

.card-bottom-link {
  cursor: pointer;
}
</style>
