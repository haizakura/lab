<template>
  <el-card shadow="always" class="project-card">
    <template #header>
      <div class="card-header">
        <div class="card-header-title cursor-pointer" @click="goTo(path as string)">
          <Icon :name="icon as string" />
          <span>{{ $t(title as string) }}</span>
        </div>
      </div>
    </template>
    <div class="project-card-body">
      <el-text line-clamp="2">{{ $t(desc as string) }}</el-text>
    </div>
    <div class="project-card-bottom">
      <el-text class="cursor-pointer" type="info" size="small" @click="goTo(path as string)">{{
        currentUrl + path
      }}</el-text>
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
