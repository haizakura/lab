<template>
  <div class="page">
    <Card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <CardHeader>
        <CardTitle class="card-header-title">
          <AppIcon :name="item.icon" class="size-5" />
          <span>{{ $t(item.title) }}</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div class="flex flex-col">
          <!-- Input Component -->
          <div class="flex flex-col">
            <Textarea
              v-model="inputString"
              :placeholder="$t('Input something here...')"
              :rows="8"
              :aria-label="$t('Input something here...')"
              autofocus
            />
          </div>

          <!-- Copy and Clear Buttons -->
          <div class="mt-4 flex flex-row justify-center gap-4">
            <Button :disabled="!inputString" @click="copy">{{ $t('Copy') }}</Button>
            <Button variant="outline" @click="clear">{{ $t('Clear') }}</Button>
          </div>

          <!-- Divider -->
          <Separator class="my-4" />

          <!-- Crypto Operations -->
          <div class="flex flex-col gap-2">
            <!-- Base64, MD5 Operations -->
            <div class="flex flex-wrap gap-2">
              <Button @click="cryptoOperation('base64', 'encode')">{{ $t('Base64 Encode') }}</Button>
              <Button @click="cryptoOperation('base64', 'decode')">{{ $t('Base64 Decode') }}</Button>
              <Button @click="cryptoOperation('md5', 'encode')">{{ $t('MD5 Encode') }}</Button>
            </div>

            <!-- SHA-1, SHA-256, SHA-384, SHA-512 Operations -->
            <div class="flex flex-wrap gap-2">
              <Button variant="secondary" @click="cryptoOperation('sha1', 'encode')">{{ $t('SHA-1 Hash') }}</Button>
              <Button variant="secondary" @click="cryptoOperation('sha256', 'encode')">{{ $t('SHA-256 Hash') }}</Button>
              <Button variant="secondary" @click="cryptoOperation('sha384', 'encode')">{{ $t('SHA-384 Hash') }}</Button>
              <Button variant="secondary" @click="cryptoOperation('sha512', 'encode')">{{ $t('SHA-512 Hash') }}</Button>
            </div>

            <!-- URI, URI Component Operations -->
            <div class="flex flex-wrap gap-2">
              <Button variant="outline" @click="cryptoOperation('uri', 'encode')">{{ $t('Encode URI') }}</Button>
              <Button variant="outline" @click="cryptoOperation('uri', 'decode')">{{ $t('Decode URI') }}</Button>
              <Button variant="outline" @click="cryptoOperation('uri-component', 'encode')">{{
                $t('Encode URI Component')
              }}</Button>
              <Button variant="outline" @click="cryptoOperation('uri-component', 'decode')">{{
                $t('Decode URI Component')
              }}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
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
        toast.error($t('Invalid operation'));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.error(`${$t(`Failed to ${operation} string`)}: ${errorMessage}`);
  }
};

// Copy string to clipboard
const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(inputString.value);
    toast.success($t('Copied to clipboard'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Unknown error');
    toast.error(`${$t('Failed to copy text')}: ${errorMessage}`);
  }
};

// Clear string
const clear = (): void => {
  inputString.value = '';
};
</script>
