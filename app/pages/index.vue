<template>
  <div class="project-search">
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput v-model="search" :placeholder="$t('Search')" autofocus @input="searchType = 'normal'" />
      <InputGroupAddon v-if="search" align="inline-end">
        <InputGroupButton size="icon-xs" :aria-label="$t('Clear')" @click="search = ''">
          <XIcon aria-hidden="true" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>

    <Button class="w-36 justify-center" @click="shuffle">
      {{ $t('Shuffle') }}
    </Button>
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
import { SearchIcon, XIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

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
