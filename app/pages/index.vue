<template>
  <div class="project-search">
    <UInput
      v-model="search"
      class="w-full"
      :placeholder="$t('Search')"
      @input="searchType = 'normal'"
      :ui="{ trailing: 'pe-1' }"
      autofocus
    >
      <template #leading>
        <UIcon name="mdi:search" class="w-6 text-lg" />
      </template>
      <template v-if="search" #trailing>
        <UButton
          color="neutral"
          variant="link"
          icon="mdi:close"
          size="sm"
          :aria-label="$t('Clear')"
          @click="search = ''"
        />
      </template>
    </UInput>

    <UButton class="w-36 justify-center" color="primary" @click="shuffle">
      {{ $t('Shuffle') }}
    </UButton>
  </div>

  <div class="project-list mt-4">
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
    void shuffleTrigger.value;
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
