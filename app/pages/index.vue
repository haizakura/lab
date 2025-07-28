<template>
  <div class="project">
    <div class="project-card" v-for="item in itemConfig">
      <ItemsProjectCard
        :key="item.name"
        :icon="item.icon"
        :title="item.title"
        :name="item.name"
        :path="item.path"
        :desc="item.desc"
        :aria-label="item.name" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig();

const itemConfig = appConfig.itemConfig;
</script>
