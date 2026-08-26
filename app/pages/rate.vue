<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="small">
    <div class="space-y-4">
      <UFormField
        :label="$t('Trans Currency')"
        orientation="horizontal"
        size="lg"
        class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-4"
        :ui="{ container: 'w-full' }"
      >
        <USelectMenu
          v-model="transCur"
          :items="transCurList"
          value-key="value"
          :placeholder="$t('Pick a Transaction Currency')"
          :aria-label="$t('Trans Currency')"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="$t('Base Currency')"
        orientation="horizontal"
        size="lg"
        class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-4"
        :ui="{ container: 'w-full' }"
      >
        <USelectMenu
          v-model="baseCur"
          :items="baseCurList"
          value-key="value"
          :placeholder="$t('Pick a Base Currency')"
          :aria-label="$t('Base Currency')"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="$t('Settlement Date')"
        orientation="horizontal"
        size="lg"
        class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UInput
          v-model="selectedDate"
          type="date"
          :placeholder="$t('Pick a Settlement Date')"
          :aria-label="$t('Settlement Date')"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="mt-5 flex justify-center">
      <UButton
        color="success"
        size="xl"
        icon="mdi:magnify"
        class="rounded-full"
        @click="getRate"
        aria-label="Get Rate"
      />
    </div>

    <USeparator v-if="rateData" class="my-6" />

    <div class="text-center" v-if="rateData">
      <span class="text-danger font-bold text-3xl">1</span>
      <span class="text-brand font-bold ml-2">{{ transCur }}</span>
      <span class="mx-2 text-3xl font-bold text-content-primary">=</span>
      <span class="text-danger font-bold text-3xl">{{ rateData }}</span>
      <span class="text-brand font-bold ml-2">{{ baseCur }}</span>
    </div>

    <USeparator v-if="rateData" class="my-6" />

    <div v-if="rateData" class="space-y-4">
      <UInput v-model.number="transNum" type="number" class="w-full" @input="calcRate" aria-label="Transaction Amount">
        <template #trailing>
          <span class="font-bold w-8 text-center">{{ transCur }}</span>
        </template>
      </UInput>
      <UInput v-model.number="baseNum" type="number" class="w-full" aria-label="Base Amount">
        <template #trailing>
          <span class="font-bold w-8 text-center">{{ baseCur }}</span>
        </template>
      </UInput>
    </div>
  </BasePageContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'rate',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.rate;
const toast = useToast();

useSeoMeta({
  title: item.title,
  description: item.desc,
});

const transCur = ref<string>('JPY');
const baseCur = ref<string>('CNY');
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const transNum = ref<number>(100);
const baseNum = ref<number>(0);
const rateData = ref<number>(0);

const transCurList = [
  { value: 'CNY', label: $t('CNY, Yuan Renminbi') },
  { value: 'JPY', label: $t('JPY, Yen') },
  { value: 'EUR', label: $t('EUR, Euro') },
  { value: 'GBP', label: $t('GBP, Pound Sterling') },
  { value: 'HKD', label: $t('HKD, Hong Kong Dollar') },
  { value: 'USD', label: $t('USD, U.S.Dollar') },
];

const baseCurList = [
  { value: 'CNY', label: $t('CNY, Yuan Renminbi') },
  { value: 'JPY', label: $t('JPY, Yen') },
  { value: 'EUR', label: $t('EUR, Euro') },
  { value: 'GBP', label: $t('GBP, Pound Sterling') },
  { value: 'HKD', label: $t('HKD, Hong Kong Dollar') },
  { value: 'USD', label: $t('USD, U.S.Dollar') },
];

const getRate = async () => {
  const [year, month, day] = selectedDate.value.split('-');
  const query = {
    transCur: transCur.value,
    baseCur: baseCur.value,
    year,
    month,
    day,
  };

  await $fetch('/api/rate', { query: query })
    .then((response) => {
      if (response?.data?.rate?.rateData) {
        rateData.value = response.data.rate.rateData;
        calcRate();
      }
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : $t('Unknown error');
      toast.add({ title: `${$t('Failed to fetch exchange rate')}: ${message}`, color: 'error' });
    });
};

const calcRate = () => {
  if (rateData.value && transNum.value) {
    baseNum.value = Number((transNum.value * rateData.value).toFixed(2));
  }
};
</script>
