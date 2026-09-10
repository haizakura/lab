<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="medium">
    <!-- ID Type List -->
    <div v-for="(item, index) in idTypeList" :key="item.type" class="flex flex-col">
      <div class="mb-2 flex flex-row items-center">
        <span class="text-base">{{ item.label }}</span>
      </div>

      <div class="flex flex-row items-center">
        <!-- Input Component -->
        <div class="w-3/4 pr-1">
          <div class="flex flex-col">
            <Input v-model="item.value" :placeholder="item.label" />
          </div>
        </div>

        <!-- Generate Button -->
        <div class="w-1/8 px-1">
          <div class="flex flex-col">
            <Button
              variant="secondary"
              size="icon"
              class="justify-center text-lg"
              :aria-label="$t('Generate')"
              @click="generate(item.type as IdTypeKey, index)"
            >
              <RefreshCwIcon aria-hidden="true" />
            </Button>
          </div>
        </div>

        <!-- Copy Button -->
        <div class="w-1/8 pl-1">
          <div class="flex flex-col">
            <Button size="icon" class="justify-center text-lg" :aria-label="$t('Copy')" @click="copy(index)">
              <CopyIcon aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <Separator v-if="index !== idTypeList.length - 1" class="my-6" />
    </div>
  </BasePageContainer>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { CopyIcon, RefreshCwIcon } from '@lucide/vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { IdGenerator } from '@/utils/idGenerator';

definePageMeta({
  name: 'randomId',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.randomId;

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
    toast.error($t('No item found'));
    return;
  }

  try {
    const generator = new IdGenerator(type);
    item.value = generator.generate();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.error($t('Failed to generate') + `: ${errorMessage}`);
    item.value = '';
  }
};

// Copy
const copy = async (index: number): Promise<void> => {
  try {
    await navigator.clipboard.writeText(idTypeList.value[index]?.value ?? '');
    toast.success($t('Copied to clipboard'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.error($t('Failed to copy text') + `: ${errorMessage}`);
  }
};

// Generate all IDs on component mount
onMounted(() => {
  idTypeList.value.forEach((item, index) => {
    generate(item.type as IdTypeKey, index);
  });
});
</script>
