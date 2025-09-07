<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="large">
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
    <div v-if="results.length > 0" class="flex flex-col gap-4 mt-4">
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

      <!-- Clear Button -->
      <div class="flex flex-col justify-center items-center">
        <el-button @click="clear">{{ $t('Clear') }}</el-button>
      </div>
    </div>
  </BasePageContainer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { UploadUserFile } from 'element-plus';

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

const convertFileToImageData = async (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData);
        } catch (error) {
          reject(new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageDataUrl;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const processQRCode = async (file: File | UploadUserFile) => {
  try {
    let actualFile: File;

    if (file instanceof File) {
      actualFile = file;
    } else if (file.raw instanceof File) {
      actualFile = file.raw;
    } else {
      throw new Error('Invalid file object');
    }

    const imageData = await convertFileToImageData(actualFile);

    const imageForDecode = {
      width: imageData.width,
      height: imageData.height,
      data: Array.from(imageData.data),
    };

    const response = await $fetch('/api/qrcode/decode', {
      method: 'POST',
      body: imageForDecode,
      responseType: 'json',
    });

    results.value.push({
      filename: actualFile.name,
      success: true,
      text: response.data,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : error?.data?.message || $t('Unknown error');
    const fileName = (file as UploadUserFile).name || 'unknown';

    results.value.push({
      filename: fileName,
      success: false,
      error: errorMessage,
    });
  }
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success($t('Copied to clipboard'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    ElMessage.error(`${$t('Failed to copy text')}: ${errorMessage}`);
  }
};

watch(qrcodeList, (newList) => {
  newList.forEach((file) => {
    const fileName = file.name || 'unknown';
    const alreadyProcessed = results.value.some((result) => result.filename === fileName);
    if (!alreadyProcessed) {
      processQRCode(file);
    }
  });
});

const clear = (): void => {
  qrcodeList.value = [] as UploadUserFile[];
  results.value = [] as DecodeResult[];
};
</script>
