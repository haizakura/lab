<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="page-card-header">
          <span class="text-2xl text-primary font-bold">{{ item.icon }} {{ $t(item.title) }}</span>
        </div>
      </template>

      <div class="card-body">
        <!-- Candidate Characters Toggle -->
        <div
          class="flex items-center gap-2 cursor-pointer text-sm text-regular"
          @click="isCandidateCharactersExpanded = !isCandidateCharactersExpanded"
        >
          <el-icon :class="{ '-rotate-90': !isCandidateCharactersExpanded }" class="transition-transform"
            ><ElIconArrowDown
          /></el-icon>
          <span>{{ $t('Candidate Characters') }}</span>
        </div>

        <!-- Candidate Characters -->
        <el-collapse-transition>
          <div v-show="isCandidateCharactersExpanded" class="mt-2 p-2 rounded-sm border border-line-light w-full">
            <el-checkbox-group v-model="charTypesList" class="flex flex-wrap gap-2">
              <el-checkbox
                v-for="character in candidateCharacters"
                :key="character.value"
                :label="character.label"
                :value="character.value"
              />
            </el-checkbox-group>
          </div>
        </el-collapse-transition>

        <!-- Custom Characters Input -->
        <el-collapse-transition>
          <el-form
            v-show="charTypesList?.includes('customCharacters')"
            label-width="auto"
            label-position="top"
            class="mt-4"
          >
            <el-form-item label="Custom Characters">
              <el-input
                v-model="customCharactersText"
                type="textarea"
                placeholder="Enter custom characters here..."
                :show-word-limit="true"
                :autosize="{ minRows: 2, maxRows: 10 }"
              />
            </el-form-item>
          </el-form>
        </el-collapse-transition>

        <!-- Custom Unicode Range Input -->
        <el-collapse-transition>
          <el-form
            v-show="charTypesList?.includes('unicodeRange')"
            label-width="auto"
            label-position="left"
            class="mt-4"
          >
            <el-form-item label="Unicode Range">
              <el-col :span="11">
                <el-input v-model="unicodeRangeText.from" placeholder="From" class="w-full" />
              </el-col>
              <el-col :span="2">
                <div class="w-full flex items-center justify-center">
                  <el-icon class="text-regular"><ElIconSemiSelect /></el-icon>
                </div>
              </el-col>
              <el-col :span="11">
                <el-input v-model="unicodeRangeText.to" placeholder="To" class="w-full" />
              </el-col>
            </el-form-item>
          </el-form>
        </el-collapse-transition>

        <el-form class="mt-4">
          <el-form-item>
            <div class="flex flex-auto">
              <!-- Pattern -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Pattern') }}</span>
                  <el-select v-model="selectedPattern" placeholder="Select a pattern" class="w-full mt-2" :aria-label="$t('Pattern')">
                    <el-option value="none" label="None" />
                    <el-option-group label="Basic Specified Samples">
                      <el-option v-for="item in basicPatternOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-option-group>
                    <el-option-group label="Unicode Range Samples">
                      <el-option v-for="item in unicodePatternOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-option-group>
                    <el-option-group label="Custom Text Samples">
                      <el-option v-for="item in customTextOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-option-group>
                  </el-select>
                </div>
              </el-col>

              <!-- Characters Usage Method -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Use Chars') }}</span>
                  <el-select v-model="usageMethod" placeholder="Select Usage Method" class="w-full mt-2" :aria-label="$t('Use Chars')">
                    <el-option v-for="item in usageOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </el-col>

              <!-- Text Length -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Text Length') }}</span>
                  <el-input-number
                    class="!w-full mt-2"
                    v-model="textLength"
                    controls-position="right"
                    :min="1"
                    :max="10000"
                    :aria-label="$t('Text Length')"
                  />
                </div>
              </el-col>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex flex-auto">
              <!-- Line Break -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Line Break') }}</span>
                  <el-select v-model="lineBreak" placeholder="Select Line Break" class="w-full mt-2" :aria-label="$t('Line Break')">
                    <el-option :value="false" label="No line break" />
                    <el-option :value="true" label="Line break" />
                  </el-select>
                </div>
              </el-col>

              <!-- Each line -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Each Line') }}</span>
                  <el-input-number class="!w-full mt-2" v-model="eachLine" controls-position="right" :min="0" :max="10000" :disabled="!lineBreak" :aria-label="$t('Each Line')" />
                </div>
              </el-col>

              <!-- Each line sorting -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Sorting') }}</span>
                  <el-select v-model="lineSorting" placeholder="Select Each Line" class="w-full mt-2" :disabled="!lineBreak" :aria-label="$t('Sorting')">
                    <el-option
                      v-for="item in lineSortingOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-col>
            </div>
          </el-form-item>
        </el-form>

        <!-- Selected candidate characters -->
        <div class="ml-1">
          <el-text type="info">{{ $t('Selected Candidate Characters') }}: 11</el-text>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-2 mt-4">
          <el-button type="success" :aria-label="$t('Generate')" @click="generateText">{{ $t('Generate') }}</el-button>
          <el-button type="primary" :aria-label="$t('Copy')" @click="copyText">{{ $t('Copy') }}</el-button>
          <el-button :aria-label="$t('Clear')" @click="clearText">{{ $t('Clear') }}</el-button>
        </div>

        <!-- Generated Text -->
        <el-collapse-transition>
          <div v-show="generatedText">
            <el-divider />
            <el-input v-model="generatedText" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" :aria-label="$t('Generated Text')" />
            <div class="mt-2">
              <el-checkbox v-model="doNotFold" :label="$t('Do not fold')" :aria-label="$t('Do not fold')" />
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'longTextMakerNew',
});

import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const appConfig = useAppConfig();
const item = appConfig.itemConfig.longTextMaker;

useSeoMeta({
  title: item.title,
  description: item.desc,
});

const candidateCharacters = ref({
  halfwidthNumbers: {
    label: 'Numbers',
    value: 'halfwidthNumbers',
  },
  halfwidthUppercase: {
    label: 'Letters (Upper)',
    value: 'halfwidthUppercase',
  },
  halfwidthLowercase: {
    label: 'Letters (Lower)',
    value: 'halfwidthLowercase',
  },
  halfwidthSymbols: {
    label: 'Symbols',
    value: 'halfwidthSymbols',
  },
  hiragana: {
    label: 'Hiragana',
    value: 'hiragana',
  },
  katakana: {
    label: 'Katakana',
    value: 'katakana',
  },
  kanjiKana: {
    label: 'Kanji Kana',
    value: 'kanjiKana',
  },
  fullwidthAlphanumeric: {
    label: 'Full-width Alphanumeric',
    value: 'fullwidthAlphanumeric',
  },
  fullwidthSymbols: {
    label: 'Full-width Symbols',
    value: 'fullwidthSymbols',
  },
  baseKanji: {
    label: 'Base Kanji',
    value: 'baseKanji',
  },
  chineseCharacters: {
    label: 'Chinese Characters',
    value: 'chineseCharacters',
  },
  unicodeRange: {
    label: 'Unicode Range',
    value: 'unicodeRange',
  },
  customCharacters: {
    label: 'Custom Characters',
    value: 'customCharacters',
  },
});

const isCandidateCharactersExpanded = ref(false);

// Pattern selection options
const selectedPattern = ref('halfwidthAlphanumeric');

const basicPatternOptions = [
  { value: 'halfwidthAlphanumeric', label: 'Half-width Alphanumeric' },
  { value: 'ascii', label: 'ASCII' },
  { value: 'hiraganaKatakana', label: 'Hiragana・Katakana' },
  { value: 'kanjiDifferentRadical', label: 'Kanji (Different Radicals)' },
  { value: 'kanjiWaterRadical', label: 'Kanji (Water Radical)' },
  { value: 'kanjiWoodRadical', label: 'Kanji (Wood Radical)' },
];

const unicodePatternOptions = [
  { value: 'braillePatterns', label: 'Braille Patterns' },
  { value: 'mathematicalSymbols', label: 'Mathematical Symbols' },
  { value: 'latinExtendedA', label: 'Latin Extended-A' },
  { value: 'unifiedCanadianAboriginal', label: 'Unified Canadian Aboriginal' },
];

const customTextOptions = [
  { value: 'irohaPoem', label: 'Iroha Poem' },
  { value: 'roundCharacters', label: 'Round Characters' },
];

// Candidate characters
const charTypesList = ref<string[]>();

// Custom characters
const customCharactersText = ref('');

// Unicode range
const unicodeRangeText = ref({
  from: '',
  to: '',
});

// Characters usage method
const usageMethod = ref('random');
const usageOptions = [
  { value: 'random', label: 'Randomly' },
  { value: 'sequential', label: 'Sequentially' },
  { value: 'repeat', label: 'Repeatedly' },
];

// Text length
const textLength = ref(100);

// Line break settings
const lineBreak = ref(false);

// Each line break
const eachLine = ref(0);

// Each line sorting method
const lineSorting = ref('none');
const lineSortingOptions = [
  { value: 'none', label: 'Do not sort' },
  { value: 'sortInUnicodeAscending', label: 'Sort in Unicode ascending order' },
  { value: 'sortInUnicodeDescending', label: 'Sort in Unicode descending order' },
  { value: 'sortInLocaleCompareAscending', label: 'Sort in localeCompare ascending order' },
  { value: 'sortInLocaleCompareDescending', label: 'Sort in localeCompare descending order' },
  { value: 'shuffle', label: 'Shuffle' },
];

// Generated text
const generatedText = ref('');

// Do not fold
const doNotFold = ref(false);

// Generate text
const generateText = () => {
  generatedText.value = 'Generated Text';
};

// Copy text
const copyText = () => {
  navigator.clipboard.writeText(generatedText.value);
  ElMessage.success('Copied to clipboard');
};

// Clear text
const clearText = () => {
  generatedText.value = '';
};
</script>
