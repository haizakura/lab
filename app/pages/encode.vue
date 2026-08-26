<template>
  <div class="page">
    <UCard class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <UIcon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>
        </div>
      </template>

      <div class="flex flex-col">
        <!-- Input Component -->
        <div class="flex flex-col">
          <UTextarea
            v-model="inputString"
            :placeholder="$t('Input something here...')"
            :rows="8"
            :aria-label="$t('Input something here...')"
            autofocus
          />
        </div>

        <!-- Copy and Clear Buttons -->
        <div class="mt-4 flex flex-row gap-4 justify-center">
          <UButton color="primary" :disabled="!inputString" @click="copy">{{ $t('Copy') }}</UButton>
          <UButton color="neutral" variant="outline" @click="clear">{{ $t('Clear') }}</UButton>
        </div>

        <!-- Divider -->
        <hr class="my-4 text-line-base w-full" />

        <!-- Crypto Operations -->
        <div class="flex flex-col gap-2">
          <!-- Base64, MD5 Operations -->
          <div class="flex flex-wrap gap-2">
            <UButton color="primary" @click="cryptoOperation('base64', 'encode')">{{ $t('Base64 Encode') }}</UButton>
            <UButton color="primary" @click="cryptoOperation('base64', 'decode')">{{ $t('Base64 Decode') }}</UButton>
            <UButton color="primary" @click="cryptoOperation('md5', 'encode')">{{ $t('MD5 Encode') }}</UButton>
          </div>

          <!-- SHA-1, SHA-256, SHA-384, SHA-512 Operations -->
          <div class="flex flex-wrap gap-2">
            <UButton color="success" @click="cryptoOperation('sha1', 'encode')">{{ $t('SHA-1 Hash') }}</UButton>
            <UButton color="success" @click="cryptoOperation('sha256', 'encode')">{{ $t('SHA-256 Hash') }}</UButton>
            <UButton color="success" @click="cryptoOperation('sha384', 'encode')">{{ $t('SHA-384 Hash') }}</UButton>
            <UButton color="success" @click="cryptoOperation('sha512', 'encode')">{{ $t('SHA-512 Hash') }}</UButton>
          </div>

          <!-- URI, URI Component Operations -->
          <div class="flex flex-wrap gap-2">
            <UButton color="warning" @click="cryptoOperation('uri', 'encode')">{{ $t('Encode URI') }}</UButton>
            <UButton color="warning" @click="cryptoOperation('uri', 'decode')">{{ $t('Decode URI') }}</UButton>
            <UButton color="warning" @click="cryptoOperation('uri-component', 'encode')">{{
              $t('Encode URI Component')
            }}</UButton>
            <UButton color="warning" @click="cryptoOperation('uri-component', 'decode')">{{
              $t('Decode URI Component')
            }}</UButton>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { CryptoUtils } from '@/utils/cryptoUtils';

type CryptoType = 'base64' | 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'uri' | 'uri-component';
type OperationType = 'encode' | 'decode';

definePageMeta({
  name: 'encode',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.encode;
const toast = useToast();

useSeoMeta({
  title: item.title,
  description: item.desc,
});

// Variables
const inputString = ref<string>('');

// Crypto operations
const cryptoOperation = async (type: CryptoType, operation: OperationType): Promise<void> => {
  try {
    const cryptoUtils = new CryptoUtils(inputString.value, type);
    switch (operation) {
      case 'encode':
        inputString.value = await cryptoUtils.encode();
        break;
      case 'decode':
        inputString.value = cryptoUtils.decode();
        break;
      default:
        toast.add({ title: $t('Invalid operation'), color: 'error' });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.add({ title: `${$t(`Failed to ${operation} string`)}: ${errorMessage}`, color: 'error' });
  }
};

// Copy string to clipboard
const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(inputString.value);
    toast.add({ title: $t('Copied to clipboard'), color: 'success' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.add({ title: `${$t('Failed to copy text')}: ${errorMessage}`, color: 'error' });
  }
};

// Clear string
const clear = (): void => {
  inputString.value = '';
};
</script>
