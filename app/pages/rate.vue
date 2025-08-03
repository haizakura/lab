<template>
  <div class="page">
    <el-card class="m-auto sm:w-sm">
      <template #header>
        <div class="card-header">
          <span class="text-2xl text-primary font-bold" @click="getRate">{{ item.icon }} {{ $t(item.title) }}</span>
        </div>
      </template>
      <el-form size="large" label-position="left" label-width="8rem">
        <el-form-item :label="$t('Trans Currency')">
          <el-select
            v-model="transCur"
            :placeholder="$t('Pick a Transaction Currency')"
            filterable
            :aria-label="$t('Trans Currency')"
          >
            <el-option
              v-for="item in transCurList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :aria-label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Base Currency')">
          <el-select
            v-model="baseCur"
            :placeholder="$t('Pick a Base Currency')"
            filterable
            :aria-label="$t('Base Currency')"
          >
            <el-option
              v-for="item in baseCurList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :aria-label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Settlement Date')">
          <el-date-picker
            class="!w-full"
            v-model="selectedDate"
            type="date"
            :placeholder="$t('Pick a Settlement Date')"
            :aria-label="$t('Settlement Date')"
          />
        </el-form-item>
      </el-form>

      <div class="flex justify-center">
        <el-button
          type="success"
          size="large"
          :icon="ElIconSearch"
          circle
          @click="getRate"
          aria-label="Get Rate"
        ></el-button>
      </div>

      <el-divider v-if="rateData"></el-divider>

      <div class="text-center" v-if="rateData">
        <span class="text-danger font-bold text-4xl">1</span>
        <span class="text-brand font-bold ml-2">{{ transCur }}</span>
        <span class="text-primary font-bold text-4xl mx-2">=</span>
        <span class="text-danger font-bold text-4xl">{{ rateData }}</span>
        <span class="text-brand font-bold ml-2">{{ baseCur }}</span>
      </div>

      <el-divider v-if="rateData"></el-divider>

      <el-form v-if="rateData">
        <el-form-item>
          <el-input v-model="transNum" @input="calcRate()" clearable aria-label="Transaction Amount">
            <template #append>
              <span class="font-bold w-8 text-center">{{ transCur }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="!mb-0">
          <el-input v-model="baseNum" aria-label="Base Amount">
            <template #append>
              <span class="font-bold w-8 text-center">{{ baseCur }}</span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'rate',
});

import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const appConfig = useAppConfig();
const item = appConfig.itemConfig.rate;

useSeoMeta({
  title: item.title,
  description: item.desc,
});

const transCur = ref<string>('JPY');
const baseCur = ref<string>('CNY');
const selectedDate = ref<Date>(new Date());
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
  const year = selectedDate.value.getFullYear().toString();
  const month = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
  const day = selectedDate.value.getDate().toString().padStart(2, '0');

  try {
    await $fetch('/api/rate', {
      query: {
        transCur: transCur.value,
        baseCur: baseCur.value,
        year: year,
        month: month,
        day: day,
      },
    })
      .then((response) => {
        if (response?.data?.rate?.rateData) {
          rateData.value = response.data.rate.rateData;
          calcRate();
        }
      })
      .catch((error) => {
        ElMessage.error(`${$t('Failed to fetch exchange rate')}: ${error.response.statusText}`);
      });
  } catch (error) {
    ElMessage.error(`${$t('Failed to fetch exchange rate')}: ${error}`);
  }
};

const calcRate = () => {
  if (rateData.value && transNum.value) {
    baseNum.value = Number((transNum.value * rateData.value).toFixed(2));
  }
};
</script>
