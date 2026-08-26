<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="x-large">
    <!-- Candidate Characters Toggle -->
    <UCollapsible v-model:open="isCandidateCharactersExpanded">
      <button type="button" class="flex cursor-pointer items-center gap-2 text-sm text-regular">
        <UIcon
          name="mdi:chevron-down"
          :class="{ '-rotate-90': !isCandidateCharactersExpanded }"
          class="transition-transform"
        />
        <span>{{ $t('Candidate Characters') }}</span>
      </button>

      <template #content>
        <div class="mt-2 w-full rounded-sm border border-line-light p-2">
          <UCheckboxGroup
            v-model="charTypesList"
            :items="candidateCharacterOptions"
            orientation="horizontal"
            :ui="{ fieldset: 'flex-wrap gap-x-4 gap-y-2' }"
          />
        </div>
      </template>
    </UCollapsible>

    <!-- Custom Characters Input -->
    <UFormField v-if="charTypesList.includes('customCharacters')" :label="$t('Custom Characters')" class="mt-4">
      <UTextarea
        v-model="customCharactersText"
        placeholder="Enter custom characters here..."
        autoresize
        :rows="2"
        :maxrows="10"
        class="w-full"
      />
    </UFormField>

    <!-- Custom Unicode Range Input -->
    <UFormField v-if="charTypesList.includes('unicodeRange')" :label="$t('Unicode Range')" class="mt-4">
      <div class="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <UFormField :error="unicodeFromError" class="w-full">
          <UInput
            :model-value="unicodeRangeForm.from"
            placeholder="[0-9A-Fa-f]{1,6}"
            maxlength="6"
            class="w-full"
            @update:model-value="(value) => handleUnicodeInputChange(String(value), 'from')"
          />
        </UFormField>
        <UIcon name="mdi:minus" class="mt-2 text-regular" />
        <UFormField :error="unicodeToError" class="w-full">
          <UInput
            :model-value="unicodeRangeForm.to"
            placeholder="[0-9A-Fa-f]{1,6}"
            maxlength="6"
            class="w-full"
            @update:model-value="(value) => handleUnicodeInputChange(String(value), 'to')"
          />
        </UFormField>
      </div>
    </UFormField>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <UFormField :label="$t('Pattern')">
        <USelect
          v-model="selectedPattern"
          :items="patternOptions"
          value-key="value"
          placeholder="Select a pattern"
          class="w-full"
          :aria-label="$t('Pattern')"
          @update:model-value="(value) => applyPatternSelection(String(value))"
        />
      </UFormField>

      <UFormField :label="$t('Use Chars')">
        <USelect
          v-model="usageMethod"
          :items="usageOptions"
          value-key="value"
          placeholder="Select Usage Method"
          class="w-full"
          :aria-label="$t('Use Chars')"
        />
      </UFormField>

      <UFormField :label="$t('Text Length')">
        <UInputNumber
          v-model="textLength"
          :min="LIMITS.TEXT_LENGTH.MIN"
          :max="LIMITS.TEXT_LENGTH.MAX"
          class="w-full"
          :aria-label="$t('Text Length')"
        />
      </UFormField>

      <UFormField :label="$t('Line Break')">
        <USelect
          v-model="lineBreak"
          :items="lineBreakOptions"
          value-key="value"
          placeholder="Select Line Break"
          class="w-full"
          :aria-label="$t('Line Break')"
        />
      </UFormField>

      <UFormField :label="$t('Each Line')">
        <UInputNumber
          v-model="eachLine"
          :min="LIMITS.EACH_LINE.MIN"
          :max="LIMITS.EACH_LINE.MAX"
          :disabled="!lineBreak"
          class="w-full"
          :aria-label="$t('Each Line')"
        />
      </UFormField>

      <UFormField :label="$t('End of Line')">
        <USelect
          v-model="endOfLine"
          :items="endOfLineOptions"
          value-key="value"
          placeholder="Select End of Line"
          class="w-full"
          :disabled="!lineBreak"
          :aria-label="$t('End of Line')"
        />
      </UFormField>
    </div>

    <!-- Selected candidate characters -->
    <div class="ml-1">
      <p class="text-sm text-info">{{ $t('Selected Candidate Characters') }}: {{ selectedCharCount }}</p>
    </div>

    <!-- Buttons -->
    <div class="flex justify-center gap-2 mt-4">
      <UButton color="success" :aria-label="$t('Generate')" @click="generateText">{{ $t('Generate') }}</UButton>
      <UButton color="primary" :disabled="!generatedText" :aria-label="$t('Copy')" @click="copyText">{{
        $t('Copy')
      }}</UButton>
      <UButton color="neutral" variant="outline" :aria-label="$t('Clear')" @click="clearText">{{
        $t('Clear')
      }}</UButton>
    </div>

    <!-- Generated Text -->
    <div v-if="generatedText" class="flex flex-col">
      <USeparator class="my-6" />
      <UTextarea
        v-model="generatedText"
        autoresize
        :rows="2"
        :maxrows="10"
        :aria-label="$t('Generated Text')"
        :wrap="noWrap ? 'off' : 'soft'"
      />
      <UCheckbox v-model="noWrap" class="mt-2" :label="$t('No Wrap')" />
    </div>
  </BasePageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'longTextMaker',
});

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
const toast = useToast();

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
const candidateCharacterOptions = Object.values(candidateCharacters);

// Form state
const customCharactersText = ref('');
const unicodeRangeForm = ref<UnicodeRangeForm>({ from: '', to: '' });

// Pattern and usage configuration
const selectedPattern = ref('none');
const usageMethod = ref<UsageMethod>('random');
const textLength = ref(100);
const lineBreak = ref(false);
const eachLine = ref(0);
const endOfLine = ref<EndOfLineType>('lf');
const generatedText = ref('');
const noWrap = ref(false);

const getUnicodeError = (field: 'from' | 'to'): string | undefined => {
  const value = unicodeRangeForm.value[field];
  if (!value) return undefined;
  if (!UNICODE_CONFIG.HEX_PATTERN.test(value)) {
    return $t('Please enter a valid hexadecimal value (0-9, A-F)');
  }

  const hexValue = parseInt(value, 16);
  if (hexValue > UNICODE_CONFIG.MAX_VALUE) {
    return $t('Unicode value exceeds maximum (10FFFF)');
  }

  const otherField = field === 'from' ? 'to' : 'from';
  const otherValue = unicodeRangeForm.value[otherField];
  if (otherValue && UNICODE_CONFIG.HEX_PATTERN.test(otherValue)) {
    const otherHexValue = parseInt(otherValue, 16);
    if (field === 'from' && hexValue > otherHexValue) {
      return $t('Start value must be less than or equal to end value');
    }
    if (field === 'to' && hexValue < otherHexValue) {
      return $t('End value must be greater than or equal to start value');
    }
  }

  return undefined;
};
const unicodeFromError = computed(() => getUnicodeError('from'));
const unicodeToError = computed(() => getUnicodeError('to'));

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

const patternOptions = [
  { value: 'none', label: $t('No pattern') },
  { type: 'label' as const, value: 'basic-label', label: $t('Basic Specified Samples') },
  ...basicPatternOptions,
  { type: 'label' as const, value: 'unicode-label', label: $t('Unicode Range Samples') },
  ...unicodePatternOptions,
  { type: 'label' as const, value: 'custom-label', label: $t('Custom Text Samples') },
  ...customTextOptions,
];

const usageOptions: SelectOption[] = [
  { value: 'random', label: $t('Randomly') },
  { value: 'ascending', label: $t('Unicode Ascending') },
  { value: 'descending', label: $t('Unicode Descending') },
];

const lineBreakOptions = [
  { value: false, label: $t('No line break') },
  { value: true, label: $t('Line break') },
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
    toast.add({ title: $t('Failed to load character data') + `: ${error}`, color: 'error' });
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

const handleUnicodeInputChange = (value: string, field: 'from' | 'to'): void => {
  unicodeRangeForm.value[field] = value.toUpperCase();
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
    toast.add({ title: $t('Please select character types first'), color: 'warning' });
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
    toast.add({ title: $t('Copied to clipboard'), color: 'success' });
  } catch (error) {
    toast.add({ title: $t('Failed to copy text') + `: ${error}`, color: 'error' });
  }
};

const clearText = (): void => {
  generatedText.value = '';
};
</script>
