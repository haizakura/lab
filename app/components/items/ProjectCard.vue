<template>
  <el-card shadow="always" class="card">
    <template #header>
      <div class="card-header">
        <span
          class="font-2xl text-primary font-bold cursor-pointer"
          @click="goTo(path as string)"
          >{{ icon }} {{ $t(title as string) }}</span
        >
      </div>
    </template>
    <div class="card-body">
      <el-text line-clamp="2">{{ $t(desc as string) }}</el-text>
    </div>
    <div class="card-bottom">
      <el-text
        class="cursor-pointer"
        type="info"
        size="small"
        @click="goTo(path as string)"
        >{{ currentUrl + path }}</el-text
      >
    </div>
  </el-card>
</template>

<script lang="ts" setup>
defineProps({
  icon: String,
  title: String,
  name: String,
  path: String,
  desc: String,
});

const currentUrl = 'https://lab.nya.run';

const goTo = (path: string) => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute(path) ?? path;
  navigateTo(route);
};
</script>
