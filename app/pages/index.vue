<template>
  <div class="project-search">
    <el-input
      class="w-full"
      v-model="search"
      :placeholder="$t('Search')"
      @input="searchType = 'normal'"
      clearable
      autofocus
    >
      <template #prefix>
        <Icon name="mdi:search" class="text-lg w-6" />
      </template>
    </el-input>

    <el-button class="w-36" type="primary" @click="shuffle">
      {{ $t('Shuffle') }}
    </el-button>
  </div>

  <div class="project-list">
    <div v-for="(item, index) in filteredItemConfig" :key="index">
      <ItemsProjectCard
        :icon="item.icon"
        :title="item.title"
        :name="item.name"
        :path="item.path"
        :desc="item.desc"
        :aria-label="$t(item.title)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'home',
});

const itemConfig = useAppConfig().itemConfig;

// Variables for search and shuffle
const search = ref<string>('');
const searchType = ref<'normal' | 'shuffle'>('normal');
const shuffleTrigger = ref<number>(0);

// Filter project list by search or shuffle
const filteredItemConfig = computed(() => {
  if (search.value && searchType.value === 'normal') {
    const keyword = search.value.toLowerCase();
    return Object.values(itemConfig).filter((item) => {
      return item.title.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
    });
  }
  if (searchType.value === 'shuffle') {
    shuffleTrigger.value;
    return Object.values(itemConfig).sort(() => Math.random() - 0.5);
  }
  return Object.values(itemConfig);
});

// Shuffle project list
const shuffle = (): void => {
  searchType.value = 'shuffle';
  search.value = '';
  shuffleTrigger.value++;
};
</script>
