<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>

          <!-- button to clear the results and file list -->
          <div class="card-header-buttons">
            <el-button @click="clear">{{ $t('Clear') }}</el-button>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <!-- Upload Component -->
        <el-upload
          drag
          multiple
          v-model:file-list="qrcodeList"
          :before-upload="parseQrcode"
          :auto-upload="false"
          :show-file-list="false"
        >
          <div class="flex flex-col items-center justify-center gap-2">
            <Icon name="mdi:cloud-upload" class="text-6xl sm:text-8xl text-info" />
            <span class="text-primary text-sm sm:text-lg">{{ $t('Drop images files here or click to upload') }}</span>
          </div>
          <template #tip>
            <span class="text-sm text-info">{{
              $t('Attach as many files as you like. The QRCode Parsing only happens in your browser.')
            }}</span>
          </template>
        </el-upload>

        <!-- Result List Component -->
        <div v-if="results.length > 0" class="flex flex-col gap-4">
          <!-- Result Item -->
          <div
            v-for="(result, index) in results"
            :key="index"
            class="flex flex-col gap-2 rounded-md border border-line-base p-2"
          >
            <!-- Result Header -->
            <div class="flex justify-between items-center gap-2">
              <!-- Status Icon and Filename -->
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <Icon v-if="result.success" name="mdi:image-check-outline" class="text-success flex-shrink-0" />
                <Icon v-else name="mdi:file-image-remove-outline" class="text-danger flex-shrink-0" />
                <span class="text-primary truncate" :title="result.filename">{{ result.filename }}</span>
              </div>

              <!-- Copy Button -->
              <div class="flex-shrink-0">
                <el-button v-if="result.success" size="small" type="primary" @click="copyText(result.text!)">{{
                  $t('Copy')
                }}</el-button>
              </div>
            </div>

            <!-- Result Content -->
            <div class="bg-fill-base px-4 py-2 rounded-md text-sm break-all">
              <span v-if="result.success" class="text-primary">{{ result.text }}</span>
              <span v-else class="text-danger font-bold">{{ result.error }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { UploadUserFile } from 'element-plus';
import { QrcodeUtils } from '@/utils/qrcodeUtils';

type DecodeResult = {
  filename: string;
  success: boolean;
  text?: string;
  error?: string;
};

definePageMeta({
  name: 'qrcodeReader',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.qrcodeReader;

useSeoMeta({
  title: item.title,
  description: item.desc,
});

const qrcodeList = ref<UploadUserFile[]>([]);
const results = ref<DecodeResult[]>([]);

const parseQrcode = (file: File) => {
  processQRCode(file);
  return false;
};

const processQRCode = async (file: File | UploadUserFile) => {
  try {
    let actualFile: File;

    if (file instanceof File) {
      actualFile = file;
    } else if (file.raw instanceof File) {
      actualFile = file.raw;
    } else {
      throw new Error(`Invalid file object: no raw File found`);
    }

    const decodeResult = await QrcodeUtils.decode(actualFile);

    results.value.push({
      filename: actualFile.name,
      success: true,
      text: decodeResult.data,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    const fileName = file.name || 'unknown';

    results.value.push({
      filename: fileName,
      success: false,
      error: errorMessage,
    });
  }
};

// Copy text to clipboard
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success($t('Copied to clipboard'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    ElMessage.error(`${$t('Failed to copy text')}: ${errorMessage}`);
  }
};

// Watch for file list changes to handle multiple files
watch(qrcodeList, (newList) => {
  newList.forEach((file) => {
    const fileName = file.name || 'unknown';
    const alreadyProcessed = results.value.some((result) => result.filename === fileName);
    if (!alreadyProcessed) {
      processQRCode(file);
    }
  });
});

// Clear results and file list
const clear = (): void => {
  qrcodeList.value = [] as UploadUserFile[];
  results.value = [] as DecodeResult[];
};
</script>
