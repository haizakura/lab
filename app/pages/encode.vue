<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>
        </div>
      </template>

      <div class="flex flex-col">
        <div class="flex flex-col">
          <el-input
            v-model="userString"
            :placeholder="$t('Input something here...')"
            type="textarea"
            :rows="8"
            :aria-label="$t('Input something here...')"
            :autofocus="true"
          />
        </div>

        <div class="mt-4 flex flex-row gap-4 justify-center">
          <el-button type="primary" class="!ml-0" @click="copy">{{ $t('Copy') }}</el-button>
          <el-button class="!ml-0" @click="clear">{{ $t('Clear') }}</el-button>
        </div>

        <hr class="my-4 text-line-base w-full" />

        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap gap-2">
            <el-button type="primary" class="!ml-0" @click="encode('base64')">{{ $t('Base64 Encode') }}</el-button>
            <el-button type="primary" class="!ml-0" @click="decode('base64')">{{ $t('Base64 Decode') }}</el-button>
            <el-button type="primary" class="!ml-0" @click="encode('md5')">{{ $t('MD5 Encode') }}</el-button>
          </div>

          <div class="flex flex-wrap gap-2">
            <el-button type="success" class="!ml-0" @click="encode('sha1')">{{ $t('SHA-1 Hash') }}</el-button>
            <el-button type="success" class="!ml-0" @click="encode('sha256')">{{ $t('SHA-256 Hash') }}</el-button>
            <el-button type="success" class="!ml-0" @click="encode('sha384')">{{ $t('SHA-384 Hash') }}</el-button>
            <el-button type="success" class="!ml-0" @click="encode('sha512')">{{ $t('SHA-512 Hash') }}</el-button>
          </div>

          <div class="flex flex-wrap gap-2">
            <el-button type="warning" class="!ml-0" @click="encode('uri')">{{ $t('Encode URI') }}</el-button>
            <el-button type="warning" class="!ml-0" @click="decode('uri')">{{ $t('Decode URI') }}</el-button>
            <el-button type="warning" class="!ml-0" @click="encode('uri-component')">{{
              $t('Encode URI Component')
            }}</el-button>
            <el-button type="warning" class="!ml-0" @click="decode('uri-component')">{{
              $t('Decode URI Component')
            }}</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { StringUtils } from '@/utils/stringUtils';

definePageMeta({
  name: 'encode',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.encode;

useSeoMeta({
  title: item.title,
  description: item.desc,
});

// Variables
const userString = ref('');

// Encode string
const encode = (type: string): void => {
  try {
    const stringUtils = new StringUtils(userString.value, type);
    userString.value = stringUtils.encode();
  } catch (error) {
    ElMessage.error($t('Failed to encode text') + `: ${error}`);
  }
};

// Decode string
const decode = (type: string): void => {
  try {
    const stringUtils = new StringUtils(userString.value, type);
    userString.value = stringUtils.decode();
  } catch (error) {
    ElMessage.error($t('Failed to decode text') + `: ${error}`);
  }
};

// Copy string to clipboard
const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(userString.value);
    ElMessage.success($t('Copied to clipboard'));
  } catch (error) {
    ElMessage.error($t('Failed to copy text') + `: ${error}`);
  }
};

// Clear string
const clear = (): void => {
  userString.value = '';
};
</script>
