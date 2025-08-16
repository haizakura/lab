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
            v-model="inputString"
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
            <el-button type="primary" class="!ml-0" @click="cryptoOperation('base64', 'encode')">{{ $t('Base64 Encode') }}</el-button>
            <el-button type="primary" class="!ml-0" @click="cryptoOperation('base64', 'decode')">{{ $t('Base64 Decode') }}</el-button>
            <el-button type="primary" class="!ml-0" @click="cryptoOperation('md5', 'encode')">{{ $t('MD5 Encode') }}</el-button>
          </div>

          <div class="flex flex-wrap gap-2">
            <el-button type="success" class="!ml-0" @click="cryptoOperation('sha1', 'encode')">{{ $t('SHA-1 Hash') }}</el-button>
            <el-button type="success" class="!ml-0" @click="cryptoOperation('sha256', 'encode')">{{ $t('SHA-256 Hash') }}</el-button>
            <el-button type="success" class="!ml-0" @click="cryptoOperation('sha384', 'encode')">{{ $t('SHA-384 Hash') }}</el-button>
            <el-button type="success" class="!ml-0" @click="cryptoOperation('sha512', 'encode')">{{ $t('SHA-512 Hash') }}</el-button>
          </div>

          <div class="flex flex-wrap gap-2">
            <el-button type="warning" class="!ml-0" @click="cryptoOperation('uri', 'encode')">{{ $t('Encode URI') }}</el-button>
            <el-button type="warning" class="!ml-0" @click="cryptoOperation('uri', 'decode')">{{ $t('Decode URI') }}</el-button>
            <el-button type="warning" class="!ml-0" @click="cryptoOperation('uri-component', 'encode')">{{
              $t('Encode URI Component')
            }}</el-button>
            <el-button type="warning" class="!ml-0" @click="cryptoOperation('uri-component', 'decode')">{{
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
import { CryptoUtils } from '@/utils/cryptoUtils';

type CryptoType = 'base64' | 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'uri' | 'uri-component';
type OperationType = 'encode' | 'decode';

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
const inputString = ref<string>('');

// Crypto operations
const cryptoOperation = (type: CryptoType, operation: OperationType): void => {
  try {
    const cryptoUtils = new CryptoUtils(inputString.value, type);
    switch (operation) {
      case 'encode':
        inputString.value = cryptoUtils.encode();
        break;
      case 'decode':
        inputString.value = cryptoUtils.decode();
        break;
      default:
        ElMessage.error($t('Invalid operation'));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    ElMessage.error(`${$t(`Failed to ${operation} string`)}: ${errorMessage}`);
  }
};

// Copy string to clipboard
const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(inputString.value);
    ElMessage.success($t('Copied to clipboard'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    ElMessage.error(`${$t('Failed to copy text')}: ${errorMessage}`);
  }
};

// Clear string
const clear = (): void => {
  inputString.value = '';
};
</script>
