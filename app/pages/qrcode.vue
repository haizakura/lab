<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'qrcode',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.qrcode;

useSeoMeta({
  title: item.title,
  description: item.desc,
});
</script>
