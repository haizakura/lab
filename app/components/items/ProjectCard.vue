<template>
  <el-card shadow="always" class="card">
    <template #header>
      <div class="card-header cursor-pointer" @click="goTo(name)">
        <div class="card-header-title text-primary">
          <Icon :name="icon" />
          <span>{{ $t(title) }}</span>
        </div>
      </div>
    </template>
    <div class="card-body">
      <el-text line-clamp="2">{{ $t(desc) }}</el-text>
    </div>
    <div class="card-bottom">
      <el-text class="cursor-pointer" type="info" size="small" @click="goTo(name)">{{ baseUrl }}{{ path }}</el-text>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const baseUrl = useAppConfig().baseUrl;

const goTo = (name: string) => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute({ name: name });
  navigateTo(route);
};
</script>
