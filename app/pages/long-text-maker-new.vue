<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="card-header">
          <span class="text-2xl text-primary font-bold">{{ item.icon }} {{ $t(item.title) }}</span>
        </div>
      </template>

      <div class="card-body">
        <!-- Candidate Characters Toggle -->
        <div
          class="flex items-center gap-2 cursor-pointer text-sm text-primary"
          @click="isCandidateCharactersExpanded = !isCandidateCharactersExpanded"
        >
          <el-icon :class="{ '-rotate-90': !isCandidateCharactersExpanded }" class="transition-transform"
            ><ElIconArrowDown
          /></el-icon>
          <span>Candidate Characters</span>
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
                  <span class="text-primary text-sm">~</span>
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
            <div class="flex flex-auto gap-2">
              <!-- Characters Usage Method -->
              <el-col :span="12">
                <div class="flex flex-wrap gap-2">
                  <span class="text-sm text-primary">Use Characters</span>
                  <el-select v-model="usageMethod" placeholder="Select Usage Method" class="w-full">
                    <el-option v-for="item in usageOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </el-col>

              <!-- Text Length -->
              <el-col :span="12">
                <div class="flex flex-wrap gap-2">
                  <span class="text-sm text-primary">Text Length</span>
                  <el-select v-model="textLength" placeholder="Select Text Length" class="w-full">
                    <el-option
                      v-for="item in textLengthOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-col>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex flex-auto gap-2">
              <!-- Line Break -->
              <el-col :span="12">
                <div class="flex flex-wrap gap-2">
                  <span class="text-sm text-primary">Line Break</span>
                  <el-select v-model="lineBreak" placeholder="Select Line Break" class="w-full">
                    <el-option
                      v-for="item in lineBreakOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-col>

              <!-- Each line sorting -->
              <el-col :span="12">
                <div v-show="lineBreak !== 'none'" class="flex flex-wrap gap-2">
                  <span class="text-sm text-primary">Each Line Sorting</span>
                  <el-select v-model="eachLine" placeholder="Select Each Line" class="w-full">
                    <el-option
                      v-for="item in eachLineOptions"
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

        <!-- Buttons -->
        <div class="flex justify-center gap-2">
          <el-button type="success" aria-label="Generate" @click="generateText">Generate</el-button>
          <el-button type="primary" aria-label="Copy" @click="copyText">Copy</el-button>
          <el-button aria-label="Clear" @click="clearText">Clear</el-button>
        </div>

        <!-- Generated Text -->
        <el-collapse-transition>
          <div v-show="generatedText">
            <el-divider />
            <el-input v-model="generatedText" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" />
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
const textLength = ref(1000);
const textLengthOptions = [
  { value: 100, label: '100 characters' },
  { value: 500, label: '500 characters' },
  { value: 1000, label: '1000 characters' },
  { value: 5000, label: '5000 characters' },
  { value: 10000, label: '10000 characters' },
];

// Line break settings
const lineBreak = ref('none');
const lineBreakOptions = [
  { value: 'none', label: 'No line break' },
  { value: 'every50', label: 'Every 50 characters' },
  { value: 'every100', label: 'Every 100 characters' },
  { value: 'everyLine', label: 'Every line' },
];

// Each line sorting method
const eachLine = ref('none');
const eachLineOptions = [
  { value: 'none', label: 'Do not sort' },
  { value: 'sortInUnicodeAscending', label: 'Sort in Unicode ascending order' },
  { value: 'sortInUnicodeDescending', label: 'Sort in Unicode descending order' },
  { value: 'sortInLocaleCompareAscending', label: 'Sort in localeCompare ascending order' },
  { value: 'sortInLocaleCompareDescending', label: 'Sort in localeCompare descending order' },
  { value: 'shuffle', label: 'Shuffle' },
];

// Generated text
const generatedText = ref('');

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
