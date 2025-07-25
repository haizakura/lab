<template>
  <div class="rate-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="font-2xl text-black font-bold" @click="getRate">{{ item.icon }} {{ $t(item.title) }}</span>
        </div>
      </template>
      <el-form size="large" label-position="left" label-width="auto">
        <el-form-item :label="$t('Transaction Currency')">
          <el-select v-model="transCur" :placeholder="$t('Pick a Transaction Currency')" filterable>
            <el-option
              v-for="item in transCurList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Base Currency')">
          <el-select v-model="baseCur" :placeholder="$t('Pick a Base Currency')" filterable>
            <el-option
              v-for="item in baseCurList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Settlement Date')">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            :placeholder="$t('Pick a Settlement Date')"
          />
        </el-form-item>
      </el-form>

      <div class="flex justify-center">
        <el-button type="success" size="large" :icon="ElIconSearch" circle @click="getRate"></el-button>
      </div>

      <el-divider v-if="rateData"></el-divider>

      <div class="text-center" v-if="rateData">
        <el-text type="danger" tag="b" class="rate-1">1</el-text>
        <el-text type="primary" tag="b" class="rate-2">&nbsp;{{ transCur }}</el-text>
        <el-text class="rate-1" style="color: #000;">&nbsp;=&nbsp;</el-text>
        <el-text type="danger" tag="b" class="rate-1">{{ rateData }}</el-text>
        <el-text type="primary" tag="b" class="rate-2">&nbsp;{{ baseCur }}</el-text>
      </div>

      <el-divider v-if="rateData"></el-divider>

      <el-form v-if="rateData">
        <el-form-item>
          <el-input v-model="transNum" @input="calcRate()" clearable>
            <template #append>{{ transCur }}</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="baseNum">
            <template #append>{{ baseCur }}</template>
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
    const response = await $fetch('/api/rate', {
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

<style lang="css" scoped>
.rate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.box-card {
  @media (min-width: 640px) {
    width: 25em;
    margin: auto;
  }
  @media (max-width: 639px) {
    margin: auto;
  }
}

.rate-1 {
  font-size: 2em;
}

.rate-2 {
  font-size: 1em;
}
</style>
