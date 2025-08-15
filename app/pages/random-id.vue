<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-md md:w-lg lg:w-xl">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>
        </div>
      </template>

      <div class="flex flex-col">
        <div class="flex flex-col" v-for="(item, index) in idTypeList" :key="item.type" :index="index">
          <div class="flex flex-row items-center mb-2">
            <span class="text-base">{{ item.label }}</span>
          </div>

          <div class="flex flex-row items-center">
            <el-col :span="18" class="pr-1">
              <div class="flex flex-col">
                <el-input v-model="item.value" :placeholder="item.label" />
              </div>
            </el-col>
            <el-col :span="3" class="px-1">
              <div class="flex flex-col">
                <el-button type="success" @click="generate(item.type as IdTypeKey, index)"
                  ><Icon name="mdi:reload" class="text-lg"
                /></el-button>
              </div>
            </el-col>
            <el-col :span="3" class="pl-1">
              <div class="flex flex-col">
                <el-button type="primary" @click="copy(index)"
                  ><Icon name="mdi:content-copy" class="text-lg"
                /></el-button>
              </div>
            </el-col>
          </div>

          <el-divider v-if="index !== idTypeList.length - 1" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
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
    ElMessage.error($t('No item found'));
    return;
  }

  try {
    const generator = new IdGenerator(type);
    item.value = generator.generate();
  } catch (error) {
    ElMessage.error($t('Failed to generate') + `: ${type}`);
    item.value = '';
  }
};

// Copy
const copy = async (index: number): Promise<void> => {
  try {
    await navigator.clipboard.writeText(idTypeList.value[index]?.value ?? '');
    ElMessage.success($t('Copied to clipboard'));
  } catch (error) {
    ElMessage.error($t('Failed to copy text') + `: ${error}`);
  }
};

// Generate all IDs on component mount
onMounted(() => {
  idTypeList.value.forEach((item, index) => {
    generate(item.type as IdTypeKey, index);
  });
});
</script>
