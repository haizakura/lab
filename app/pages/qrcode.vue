<template>
  <div class="page">
    <el-card class="m-auto sm:w-md">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>
        </div>
      </template>

      <div class="flex flex-col">
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

          <el-form-item :label="$t('Size')">
            <el-input-number class="!w-full" v-model="form.size" :min="48" :max="512" controls-position="right">
              <template #suffix>
                <span>px</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-form>
        <div class="flex flex-row gap-4 justify-center">
          <el-button type="primary" @click="generateQrcode">{{ $t('Generate') }}</el-button>
          <el-button class="!ml-0" @click="clear">{{ $t('Clear') }}</el-button>
        </div>

        <div v-if="qrcode" class="w-full h-full flex flex-col items-center justify-center gap-4">
          <hr class="mt-4 text-line-base w-full" />
          <el-image :src="qrcode" class="max-w-full" />
          <el-button type="primary" @click="downloadQrcode">{{ $t('Download') }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
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
  size: 256,
});

const qrcode = ref('');

const generateQrcode = () => {
  qrcode.value = `https://www.west.cn/web/tool/codepayimg?uuid=${form.text}`;
};

const downloadQrcode = () => {
  window.open(qrcode.value, '_blank');
};

const clear = () => {
  form.text = '';
  form.size = 256;
  qrcode.value = '';
};
</script>
