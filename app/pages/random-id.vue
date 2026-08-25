<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="medium">
    <!-- ID Type List -->
    <div class="flex flex-col" v-for="(item, index) in idTypeList" :key="item.type" :index="index">
      <div class="flex flex-row items-center mb-2">
        <span class="text-base">{{ item.label }}</span>
      </div>

      <div class="flex flex-row items-center">
        <!-- Input Component -->
        <div class="w-3/4 pr-1">
          <div class="flex flex-col">
            <UInput v-model="item.value" :placeholder="item.label" />
          </div>
        </div>

        <!-- Generate Button -->
        <div class="w-1/8 px-1">
          <div class="flex flex-col">
            <UButton
              color="success"
              icon="mdi:reload"
              class="justify-center text-lg"
              :aria-label="$t('Generate')"
              @click="generate(item.type as IdTypeKey, index)"
            />
          </div>
        </div>

        <!-- Copy Button -->
        <div class="w-1/8 pl-1">
          <div class="flex flex-col">
            <UButton
              color="primary"
              icon="mdi:content-copy"
              class="justify-center text-lg"
              :aria-label="$t('Copy')"
              @click="copy(index)"
            />
          </div>
        </div>
      </div>

      <!-- Divider -->
      <USeparator v-if="index !== idTypeList.length - 1" class="my-6" />
    </div>
  </BasePageContainer>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { IdGenerator } from '@/utils/idGenerator';

definePageMeta({
  name: 'randomId',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.randomId;
const toast = useToast();

useSeoMeta({
  title: item.title,
  description: item.desc,
});

interface IdTypeItem {
  type: string;
  value: string;
  label: string;
}

type IdTypeKey = 'uuidv4' | 'cuid' | 'uuidv1';

const ID_TYPES: IdTypeItem[] = [
  {
    type: 'uuidv4',
    value: '',
    label: 'UUID v4',
  },
  {
    type: 'cuid',
    value: '',
    label: 'CUID',
  },
  {
    type: 'uuidv1',
    value: '',
    label: 'UUID v1',
  },
];

const idTypeList: Ref<IdTypeItem[]> = ref([...ID_TYPES]);

// Generate
const generate = (type: IdTypeKey, index: number): void => {
  const item = idTypeList.value[index];
  if (!item) {
    toast.add({ title: $t('No item found'), color: 'error' });
    return;
  }

  try {
    const generator = new IdGenerator(type);
    item.value = generator.generate();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.add({ title: $t('Failed to generate') + `: ${errorMessage}`, color: 'error' });
    item.value = '';
  }
};

// Copy
const copy = async (index: number): Promise<void> => {
  try {
    await navigator.clipboard.writeText(idTypeList.value[index]?.value ?? '');
    toast.add({ title: $t('Copied to clipboard'), color: 'success' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.add({ title: $t('Failed to copy text') + `: ${errorMessage}`, color: 'error' });
  }
};

// Generate all IDs on component mount
onMounted(() => {
  idTypeList.value.forEach((item, index) => {
    generate(item.type as IdTypeKey, index);
  });
});
</script>
