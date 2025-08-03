<template>
  <div class="project-list">
    <div v-for="item in itemConfig" :key="item.name" class="project-list-item">
      <ItemsProjectCard
        :icon="item.icon"
        :title="item.title"
        :name="item.name"
        :path="item.path"
        :desc="item.desc"
        :aria-label="item.name"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig();

const itemConfig = appConfig.itemConfig;
</script>
