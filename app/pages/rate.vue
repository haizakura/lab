<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="small">
    <div class="space-y-4">
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-4">
        <Label for="trans-currency">{{ $t('Trans Currency') }}</Label>
        <Select :model-value="transCur" @update:model-value="setTransCurrency">
          <SelectTrigger id="trans-currency" class="w-full" :aria-label="$t('Trans Currency')">
            <SelectValue :placeholder="$t('Pick a Transaction Currency')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="currency in transCurList" :key="currency.value" :value="currency.value">
              {{ currency.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-4">
        <Label for="base-currency">{{ $t('Base Currency') }}</Label>
        <Select :model-value="baseCur" @update:model-value="setBaseCurrency">
          <SelectTrigger id="base-currency" class="w-full" :aria-label="$t('Base Currency')">
            <SelectValue :placeholder="$t('Pick a Base Currency')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="currency in baseCurList" :key="currency.value" :value="currency.value">
              {{ currency.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-4">
        <Label for="settlement-date">{{ $t('Settlement Date') }}</Label>
        <Input
          id="settlement-date"
          v-model="selectedDate"
          type="date"
          :placeholder="$t('Pick a Settlement Date')"
          :aria-label="$t('Settlement Date')"
          class="w-full"
        />
      </div>
    </div>

    <div class="mt-5 flex justify-center">
      <Button size="icon-lg" class="rounded-full" @click="getRate" aria-label="Get Rate">
        <SearchIcon aria-hidden="true" />
      </Button>
    </div>

    <Separator v-if="rateData" class="my-6" />

    <div v-if="rateData" class="text-center">
      <span class="text-3xl font-bold text-destructive">1</span>
      <span class="ml-2 font-bold text-primary">{{ transCur }}</span>
      <span class="mx-2 text-3xl font-bold text-foreground">=</span>
      <span class="text-3xl font-bold text-destructive">{{ rateData }}</span>
      <span class="ml-2 font-bold text-primary">{{ baseCur }}</span>
    </div>

    <Separator v-if="rateData" class="my-6" />

    <div v-if="rateData" class="space-y-4">
      <InputGroup>
        <InputGroupInput
          :model-value="transNum"
          type="number"
          aria-label="Transaction Amount"
          @update:model-value="setTransactionAmount"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText class="w-8 justify-center font-bold">{{ transCur }}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          :model-value="baseNum"
          type="number"
          aria-label="Base Amount"
          @update:model-value="setBaseAmount"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText class="w-8 justify-center font-bold">{{ baseCur }}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </BasePageContainer>
</template>

<script lang="ts" setup>
import type { AcceptableValue } from 'reka-ui';
import { SearchIcon } from '@lucide/vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

definePageMeta({
  name: 'rate',
});

const appConfig = useAppConfig();
const item = appConfig.itemConfig.rate;

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

const setTransCurrency = (value: AcceptableValue) => {
  transCur.value = String(value);
};

const setBaseCurrency = (value: AcceptableValue) => {
  baseCur.value = String(value);
};

const setTransactionAmount = (value: string | number) => {
  transNum.value = Number(value);
  calcRate();
};

const setBaseAmount = (value: string | number) => {
  baseNum.value = Number(value);
};

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
      toast.error(`${$t('Failed to fetch exchange rate')}: ${message}`);
    });
};

const calcRate = () => {
  if (rateData.value && transNum.value) {
    baseNum.value = Number((transNum.value * rateData.value).toFixed(2));
  }
};
</script>
