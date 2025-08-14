<template>
  <div class="page">
    <el-card class="m-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="item.icon" />
            <span>{{ $t(item.title) }}</span>
          </div>
        </div>
      </template>

      <div>
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
            <el-form-item :label="$t('Custom Characters')">
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
            ref="unicodeFormRef"
            v-show="charTypesList?.includes('unicodeRange')"
            :model="unicodeRangeForm"
            :rules="unicodeFormRules"
            label-width="auto"
            label-position="left"
            class="mt-4"
          >
            <el-form-item :label="$t('Unicode Range')" class="mb-2">
              <el-col :span="11">
                <el-form-item prop="from" class="mb-0">
                  <el-input
                    :model-value="unicodeRangeForm.from"
                    @input="(value: string) => handleUnicodeInputChange(value, 'from')"
                    placeholder="[0-9A-Fa-f]{1,6}"
                    class="w-full"
                    maxlength="6"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="w-full flex items-center justify-center">
                  <el-icon class="text-regular"><ElIconSemiSelect /></el-icon>
                </div>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="to" class="mb-0">
                  <el-input
                    :model-value="unicodeRangeForm.to"
                    @input="(value: string) => handleUnicodeInputChange(value, 'to')"
                    placeholder="[0-9A-Fa-f]{1,6}"
                    class="w-full"
                    maxlength="6"
                  />
                </el-form-item>
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
                  <el-select
                    v-model="selectedPattern"
                    placeholder="Select a pattern"
                    class="w-full mt-2"
                    :aria-label="$t('Pattern')"
                    @change="onPatternChange"
                  >
                    <el-option value="none" :label="$t('No pattern')" />
                    <el-option-group :label="$t('Basic Specified Samples')">
                      <el-option
                        v-for="item in basicPatternOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                    <el-option-group :label="$t('Unicode Range Samples')">
                      <el-option
                        v-for="item in unicodePatternOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                    <el-option-group :label="$t('Custom Text Samples')">
                      <el-option
                        v-for="item in customTextOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </div>
              </el-col>

              <!-- Characters Usage Method -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Use Chars') }}</span>
                  <el-select
                    v-model="usageMethod"
                    placeholder="Select Usage Method"
                    class="w-full mt-2"
                    :aria-label="$t('Use Chars')"
                  >
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
                  <el-select
                    v-model="lineBreak"
                    placeholder="Select Line Break"
                    class="w-full mt-2"
                    :aria-label="$t('Line Break')"
                  >
                    <el-option :value="false" :label="$t('No line break')" />
                    <el-option :value="true" :label="$t('Line break')" />
                  </el-select>
                </div>
              </el-col>

              <!-- Each line -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('Each Line') }}</span>
                  <el-input-number
                    class="!w-full mt-2"
                    v-model="eachLine"
                    controls-position="right"
                    :min="0"
                    :max="10000"
                    :disabled="!lineBreak"
                    :aria-label="$t('Each Line')"
                  />
                </div>
              </el-col>

              <!-- End of Line -->
              <el-col :span="8" class="px-1">
                <div class="flex flex-col">
                  <span class="text-sm text-regular">{{ $t('End of Line') }}</span>
                  <el-select
                    v-model="endOfLine"
                    placeholder="Select End of Line"
                    class="!w-full mt-2"
                    :disabled="!lineBreak"
                    :aria-label="$t('End of Line')"
                  >
                    <el-option
                      v-for="item in endOfLineOptions"
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
          <el-text type="info">{{ $t('Selected Candidate Characters') }}: {{ selectedCharCount }}</el-text>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-2 mt-4">
          <el-button type="success" :aria-label="$t('Generate')" @click="generateText">{{ $t('Generate') }}</el-button>
          <el-button type="primary" :aria-label="$t('Copy')" @click="copyText">{{ $t('Copy') }}</el-button>
          <el-button :aria-label="$t('Clear')" @click="clearText">{{ $t('Clear') }}</el-button>
        </div>

        <!-- Generated Text -->
        <el-collapse-transition>
          <div v-show="generatedText" class="flex flex-col">
            <el-divider />
            <el-input
              v-model="generatedText"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10 }"
              :aria-label="$t('Generated Text')"
              :wrap="noWrap ? 'off' : 'soft'"
            />
            <el-checkbox v-model="noWrap" class="mt-2" :label="$t('No Wrap')" />
          </div>
        </el-collapse-transition>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'longTextMaker',
});

import { ref, computed, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

// Type definitions
interface CharacterType {
  label: string;
  value: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface UnicodeRangeForm {
  from: string;
  to: string;
}

interface CharacterData {
  length: number;
  characters: string[];
}

interface CharsJsonData {
  [key: string]: CharacterData;
}

type UsageMethod = 'random' | 'ascending' | 'descending';
type EndOfLineType = 'lf' | 'cr' | 'crlf';

// Constants and configurations
const UNICODE_CONFIG = {
  MAX_VALUE: 0x10ffff,
  HEX_PATTERN: /^[0-9A-Fa-f]{1,6}$/,
  CDN_URL: 'https://cdn.jsdelivr.net/gh/haizakura/cdn@2.1/lab/json/chars.json',
} as const;

const LIMITS = {
  TEXT_LENGTH: { MIN: 1, MAX: 10000 },
  EACH_LINE: { MIN: 0, MAX: 10000 },
  UNICODE_INPUT_MAX_LENGTH: 6,
} as const;

const PRESET_TEXTS = {
  irohaPoem: 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせすん',
  roundCharacters: '。｡༚࿁࿀൦ᴑᴏ๐oοоօߋ໐ᦞ᧐٥౦೦ዐ0ଠOΟОՕഠⵔ៰∘᠐ᵒᴼº°゜ﾟ',
} as const;

const UNICODE_RANGES = {
  braillePatterns: { from: '2800', to: '28FF' },
  mathematicalSymbols: { from: '2200', to: '22FF' },
  latinExtendedA: { from: '0100', to: '017F' },
  unifiedCanadianAboriginal: { from: '1400', to: '167F' },
} as const;

const appConfig = useAppConfig();
const item = appConfig.itemConfig.longTextMaker;

useSeoMeta({
  title: item.title,
  description: item.desc,
});

/**
 * Variables & Reactive References
 */

// Character data
const charsJsonData = ref<CharsJsonData | undefined>(undefined);

// Candidate characters state
const charTypesList = ref<string[]>([]);
const isCandidateCharactersExpanded = ref(false);

// Candidate character type definitions
const candidateCharacters: Record<string, CharacterType> = {
  halfwidthNumbers: { label: $t('Numbers'), value: 'halfwidthNumbers' },
  halfwidthUppercase: { label: $t('Letters (Upper)'), value: 'halfwidthUppercase' },
  halfwidthLowercase: { label: $t('Letters (Lower)'), value: 'halfwidthLowercase' },
  halfwidthSymbols: { label: $t('Symbols'), value: 'halfwidthSymbols' },
  hiragana: { label: $t('Hiragana'), value: 'hiragana' },
  katakana: { label: $t('Katakana'), value: 'katakana' },
  kanjiKana: { label: $t('Kanji Kana'), value: 'kanjiKana' },
  fullwidthAlphanumeric: { label: $t('Full-width Alphanumeric'), value: 'fullwidthAlphanumeric' },
  fullwidthSymbols: { label: $t('Full-width Symbols'), value: 'fullwidthSymbols' },
  baseKanji: { label: $t('Base Kanji'), value: 'baseKanji' },
  chineseCharacters: { label: $t('Chinese Characters'), value: 'chineseCharacters' },
  unicodeRange: { label: $t('Unicode Range'), value: 'unicodeRange' },
  customCharacters: { label: $t('Custom Characters'), value: 'customCharacters' },
};

// Form state
const customCharactersText = ref('');
const unicodeRangeForm = ref<UnicodeRangeForm>({ from: '', to: '' });
const unicodeFormRef = ref();

// Pattern and usage configuration
const selectedPattern = ref('none');
const usageMethod = ref<UsageMethod>('random');
const textLength = ref(100);
const lineBreak = ref(false);
const eachLine = ref(0);
const endOfLine = ref<EndOfLineType>('lf');
const generatedText = ref('');
const noWrap = ref(false);

// Unicode validation helper
const validateUnicodeValue = (value: string, isFromField: boolean, callback: Function) => {
  if (!value) {
    callback();
    return;
  }

  if (!UNICODE_CONFIG.HEX_PATTERN.test(value)) {
    callback(new Error($t('Please enter a valid hexadecimal value (0-9, A-F)')));
    return;
  }

  const hexValue = parseInt(value, 16);
  if (hexValue > UNICODE_CONFIG.MAX_VALUE) {
    callback(new Error($t('Unicode value exceeds maximum (10FFFF)')));
    return;
  }

  // Cross-validation
  const otherValue = isFromField ? unicodeRangeForm.value.to : unicodeRangeForm.value.from;
  if (otherValue) {
    const otherHexValue = parseInt(otherValue, 16);
    if (isFromField && hexValue > otherHexValue) {
      callback(new Error($t('Start value must be less than or equal to end value')));
      return;
    }
    if (!isFromField && hexValue < otherHexValue) {
      callback(new Error($t('End value must be greater than or equal to start value')));
      return;
    }
  }

  callback();
};

// Unicode form validation rules
const unicodeFormRules = {
  from: [
    {
      validator: (_rule: any, value: string, callback: Function) => validateUnicodeValue(value, true, callback),
      trigger: ['blur', 'change'],
    },
  ],
  to: [
    {
      validator: (_rule: any, value: string, callback: Function) => validateUnicodeValue(value, false, callback),
      trigger: ['blur', 'change'],
    },
  ],
};

// Configuration options
const basicPatternOptions: SelectOption[] = [
  { value: 'halfwidthAlphanumeric', label: $t('Half-width Alphanumeric') },
  { value: 'ascii', label: $t('ASCII') },
  { value: 'hiraganaKatakana', label: $t('Hiragana・Katakana') },
  { value: 'baseKanji', label: $t('Base Kanji') },
  { value: 'chineseCharacters', label: $t('Chinese Characters') },
];

const unicodePatternOptions: SelectOption[] = [
  { value: 'braillePatterns', label: $t('Braille Patterns') },
  { value: 'mathematicalSymbols', label: $t('Mathematical Symbols') },
  { value: 'latinExtendedA', label: $t('Latin Extended-A') },
  { value: 'unifiedCanadianAboriginal', label: $t('Unified Canadian Aboriginal') },
];

const customTextOptions: SelectOption[] = [
  { value: 'irohaPoem', label: $t('Iroha Poem') },
  { value: 'roundCharacters', label: $t('Round Characters') },
];

const usageOptions: SelectOption[] = [
  { value: 'random', label: $t('Randomly') },
  { value: 'ascending', label: $t('Unicode Ascending') },
  { value: 'descending', label: $t('Unicode Descending') },
];

const endOfLineOptions: SelectOption[] = [
  { value: 'lf', label: 'LF' },
  { value: 'cr', label: 'CR' },
  { value: 'crlf', label: 'CRLF' },
];

/**
 * Data loading and lifecycle
 */

const loadCharacterData = async (): Promise<void> => {
  try {
    charsJsonData.value = await $fetch<CharsJsonData>(UNICODE_CONFIG.CDN_URL);
  } catch (error) {
    ElMessage.error($t('Failed to load character data') + `: ${error}`);
  }
};

onMounted(() => {
  loadCharacterData();
});

/**
 * Computed properties
 */

const selectedCharCount = computed((): number => {
  if (!charTypesList.value || charTypesList.value.length === 0) return 0;

  return charTypesList.value.reduce((count, charType) => {
    switch (charType) {
      case 'customCharacters':
        return count + (customCharactersText.value?.length || 0);
      case 'unicodeRange':
        return count + getUnicodeRangeCount();
      default:
        return count + (charsJsonData.value?.[charType]?.length || 0);
    }
  }, 0);
});

const getUnicodeRangeCount = (): number => {
  const { from, to } = unicodeRangeForm.value;
  if (!from || !to || !UNICODE_CONFIG.HEX_PATTERN.test(from) || !UNICODE_CONFIG.HEX_PATTERN.test(to)) {
    return 0;
  }
  const fromCode = parseInt(from, 16);
  const toCode = parseInt(to, 16);
  return Math.max(0, toCode - fromCode + 1);
};

/**
 * Pattern and form handling methods
 */

const applyPatternSelection = (pattern: string): void => {
  const patternConfigs: Record<string, () => void> = {
    none: () => {
      charTypesList.value = [];
    },
    halfwidthAlphanumeric: () => {
      charTypesList.value = ['halfwidthNumbers', 'halfwidthUppercase', 'halfwidthLowercase'];
    },
    ascii: () => {
      charTypesList.value = ['halfwidthNumbers', 'halfwidthUppercase', 'halfwidthLowercase', 'halfwidthSymbols'];
    },
    hiraganaKatakana: () => {
      charTypesList.value = ['hiragana', 'katakana'];
    },
    baseKanji: () => {
      charTypesList.value = ['baseKanji'];
    },
    chineseCharacters: () => {
      charTypesList.value = ['chineseCharacters'];
    },
    braillePatterns: () => {
      charTypesList.value = ['unicodeRange'];
      Object.assign(unicodeRangeForm.value, UNICODE_RANGES.braillePatterns);
    },
    mathematicalSymbols: () => {
      charTypesList.value = ['unicodeRange'];
      Object.assign(unicodeRangeForm.value, UNICODE_RANGES.mathematicalSymbols);
    },
    latinExtendedA: () => {
      charTypesList.value = ['unicodeRange'];
      Object.assign(unicodeRangeForm.value, UNICODE_RANGES.latinExtendedA);
    },
    unifiedCanadianAboriginal: () => {
      charTypesList.value = ['unicodeRange'];
      Object.assign(unicodeRangeForm.value, UNICODE_RANGES.unifiedCanadianAboriginal);
    },
    irohaPoem: () => {
      charTypesList.value = ['customCharacters'];
      customCharactersText.value = PRESET_TEXTS.irohaPoem;
    },
    roundCharacters: () => {
      charTypesList.value = ['customCharacters'];
      customCharactersText.value = PRESET_TEXTS.roundCharacters;
    },
  };

  const applyConfig = patternConfigs[pattern] || patternConfigs.none;
  applyConfig?.();
};

const onPatternChange = (): void => {
  applyPatternSelection(selectedPattern.value);
};

const handleUnicodeInputChange = (value: string, field: 'from' | 'to'): void => {
  const upperValue = value.toUpperCase();
  unicodeRangeForm.value[field] = upperValue;

  nextTick(() => {
    if (unicodeFormRef.value) {
      unicodeFormRef.value.validateField([field]);
      const otherField = field === 'from' ? 'to' : 'from';
      if (unicodeRangeForm.value[otherField]) {
        unicodeFormRef.value.validateField([otherField]);
      }
    }
  });
};

const isValidUnicodeRange = (): boolean => {
  const { from, to } = unicodeRangeForm.value;

  if (!from || !to) return false;
  if (!UNICODE_CONFIG.HEX_PATTERN.test(from) || !UNICODE_CONFIG.HEX_PATTERN.test(to)) return false;

  const fromCode = parseInt(from, 16);
  const toCode = parseInt(to, 16);

  return fromCode <= UNICODE_CONFIG.MAX_VALUE && toCode <= UNICODE_CONFIG.MAX_VALUE && fromCode <= toCode;
};

/**
 * Text generation methods
 */

const createCharactersList = (): string[] => {
  if (!charTypesList.value?.length) return [];

  const charactersList: string[] = [];

  for (const charType of charTypesList.value) {
    switch (charType) {
      case 'customCharacters':
        if (customCharactersText.value) {
          charactersList.push(...Array.from(customCharactersText.value));
        }
        break;
      case 'unicodeRange':
        if (isValidUnicodeRange()) {
          const fromCode = parseInt(unicodeRangeForm.value.from, 16);
          const toCode = parseInt(unicodeRangeForm.value.to, 16);
          for (let i = fromCode; i <= toCode; i++) {
            charactersList.push(String.fromCharCode(i));
          }
        }
        break;
      default:
        const charData = charsJsonData.value?.[charType];
        if (charData?.characters) {
          charactersList.push(...charData.characters);
        }
        break;
    }
  }

  return charactersList;
};

const getLineBreakChar = (lineBreakType: EndOfLineType): string => {
  const lineBreakMap: Record<EndOfLineType, string> = {
    lf: '\n',
    cr: '\r',
    crlf: '\r\n',
  };
  return lineBreakMap[lineBreakType] || '\n';
};

const applyLineBreaks = (text: string): string => {
  if (!lineBreak.value || eachLine.value <= 0) return text;

  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += eachLine.value) {
    chunks.push(text.slice(i, i + eachLine.value));
  }

  return chunks.join(getLineBreakChar(endOfLine.value));
};

const generateSortedText = (characters: string[], isAscending: boolean = true): string => {
  const sortedChars = [...characters].sort((a, b) =>
    isAscending ? a.charCodeAt(0) - b.charCodeAt(0) : b.charCodeAt(0) - a.charCodeAt(0),
  );

  const uniqueChars = [...new Set(sortedChars)];
  if (uniqueChars.length === 0) return '';

  // Use array approach for better performance
  const result: string[] = [];
  for (let i = 0; i < textLength.value; i++) {
    const char = uniqueChars[i % uniqueChars.length];
    if (char !== undefined) {
      result.push(char);
    }
  }

  return applyLineBreaks(result.join(''));
};

const generateRandomText = (characters: string[]): string => {
  if (characters.length === 0) return '';

  // Use array approach for better performance
  const result: string[] = [];
  for (let i = 0; i < textLength.value; i++) {
    const char = characters[Math.floor(Math.random() * characters.length)];
    if (char !== undefined) {
      result.push(char);
    }
  }

  return applyLineBreaks(result.join(''));
};

/**
 * Main action methods
 */

const generateText = (): void => {
  const charactersList = createCharactersList();

  if (charactersList.length === 0) {
    ElMessage.warning($t('Please select character types first'));
    return;
  }

  const textGenerators: Record<UsageMethod, (chars: string[]) => string> = {
    random: generateRandomText,
    ascending: (chars) => generateSortedText(chars, true),
    descending: (chars) => generateSortedText(chars, false),
  };

  const generator = textGenerators[usageMethod.value];
  generatedText.value = generator(charactersList);
};

const copyText = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(generatedText.value);
    ElMessage.success($t('Copied to clipboard'));
  } catch (error) {
    ElMessage.error($t('Failed to copy text') + `: ${error}`);
  }
};

const clearText = (): void => {
  generatedText.value = '';
};
</script>
