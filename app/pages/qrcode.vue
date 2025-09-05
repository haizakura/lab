<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="medium">
    <el-form :model="form" label-width="auto" label-position="top">
      <el-form-item :label="$t('Text')">
        <el-input
          v-model="form.text"
          type="textarea"
          :placeholder="$t('Input something here...')"
          :aria-label="$t('Input something here...')"
          :autosize="{ minRows: 2, maxRows: 10 }"
          :autofocus="true"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('Scale')">
        <el-radio-group v-model="form.scale">
          <el-radio :value="8">8x</el-radio>
          <el-radio :value="16">16x</el-radio>
          <el-radio :value="24">24x</el-radio>
          <el-radio :value="32">32x</el-radio>
          <el-radio :value="48">48x</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="flex flex-row gap-4 justify-center">
      <el-button type="primary" @click="generateQrcode">{{ $t('Generate') }}</el-button>
      <el-button @click="clear">{{ $t('Clear') }}</el-button>
    </div>

    <div v-if="qrcode" class="w-full h-full flex flex-col items-center justify-center gap-4">
      <hr class="mt-4 text-line-base w-full" />
      <el-image :src="qrcode" class="max-w-full" />
      <el-button type="primary" @click="downloadQrcode">{{ $t('Download') }}</el-button>
    </div>
  </BasePageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'qrcode',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.qrcode;

useSeoMeta({
  title: item.title,
  description: item.desc,
});

const form = reactive({
  text: '',
  scale: 8,
});

const qrcode = ref('');

const generateQrcode = async () => {
  if (!form.text) {
    ElMessage.warning($t('Please enter text to generate QR code'));
    return;
  }

  try {
    const response = await $fetch('/api/qrcode', {
      method: 'POST',
      body: { text: form.text, scale: form.scale },
      responseType: 'arrayBuffer',
    });

    const blob = new Blob([response as unknown as ArrayBuffer], { type: 'image/gif' });
    const imageUrl = URL.createObjectURL(blob);
    qrcode.value = imageUrl;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : $t('Failed to generate QR code');
    ElMessage.error(errorMessage);
  }
};

const downloadQrcode = async () => {
  if (!qrcode.value) return;

  try {
    const link = document.createElement('a');
    link.href = qrcode.value;
    link.download = `qrcode-${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : $t('Failed to download QR code');
    ElMessage.error(errorMessage);
  }
};

const clear = () => {
  if (qrcode.value && qrcode.value.startsWith('blob:')) {
    URL.revokeObjectURL(qrcode.value);
  }

  form.text = '';
  form.scale = 8;
  qrcode.value = '';
};

onBeforeUnmount(() => {
  if (qrcode.value && qrcode.value.startsWith('blob:')) {
    URL.revokeObjectURL(qrcode.value);
  }
});
</script>
