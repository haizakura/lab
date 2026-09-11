<template>
  <BasePageContainer :icon="item.icon" :title="item.title" size="x-large">
    <!-- Candidate Characters Toggle -->
    <Collapsible v-model:open="isCandidateCharactersExpanded">
      <CollapsibleTrigger as-child>
        <button type="button" class="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <ChevronDownIcon
            :class="{ '-rotate-90': !isCandidateCharactersExpanded }"
            class="size-4 transition-transform"
            aria-hidden="true"
          />
          <span>{{ $t('Candidate Characters') }}</span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <fieldset class="mt-2 flex w-full flex-wrap gap-x-4 gap-y-2 rounded-md border border-border p-3">
          <legend class="sr-only">{{ $t('Candidate Characters') }}</legend>
          <div v-for="option in candidateCharacterOptions" :key="option.value" class="flex items-center gap-2">
            <Checkbox
              :id="`candidate-${option.value}`"
              :model-value="charTypesList.includes(option.value)"
              @update:model-value="(checked) => toggleCharacterType(option.value, checked === true)"
            />
            <Label :for="`candidate-${option.value}`">{{ option.label }}</Label>
          </div>
        </fieldset>
      </CollapsibleContent>
    </Collapsible>

    <!-- Custom Characters Input -->
    <div v-if="charTypesList.includes('customCharacters')" class="mt-4 space-y-2">
      <Label for="custom-characters">{{ $t('Custom Characters') }}</Label>
      <Textarea
        id="custom-characters"
        v-model="customCharactersText"
        placeholder="Enter custom characters here..."
        :rows="2"
        class="max-h-64 w-full overflow-y-auto"
      />
    </div>

    <!-- Custom Unicode Range Input -->
    <div v-if="charTypesList.includes('unicodeRange')" class="mt-4 space-y-2">
      <Label>{{ $t('Unicode Range') }}</Label>
      <div class="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <div class="space-y-1">
          <Input
            :model-value="unicodeRangeForm.from"
            placeholder="[0-9A-Fa-f]{1,6}"
            maxlength="6"
            class="w-full"
            aria-label="Unicode range start"
            :aria-invalid="Boolean(unicodeFromError)"
            :aria-describedby="unicodeFromError ? 'unicode-from-error' : undefined"
            @update:model-value="(value) => handleUnicodeInputChange(String(value), 'from')"
          />
          <p v-if="unicodeFromError" id="unicode-from-error" class="text-sm text-destructive" role="alert">
            {{ unicodeFromError }}
          </p>
        </div>
        <MinusIcon class="mt-2 size-4 text-muted-foreground" aria-hidden="true" />
        <div class="space-y-1">
          <Input
            :model-value="unicodeRangeForm.to"
            placeholder="[0-9A-Fa-f]{1,6}"
            maxlength="6"
            class="w-full"
            aria-label="Unicode range end"
            :aria-invalid="Boolean(unicodeToError)"
            :aria-describedby="unicodeToError ? 'unicode-to-error' : undefined"
            @update:model-value="(value) => handleUnicodeInputChange(String(value), 'to')"
          />
          <p v-if="unicodeToError" id="unicode-to-error" class="text-sm text-destructive" role="alert">
            {{ unicodeToError }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="space-y-2">
        <Label for="pattern">{{ $t('Pattern') }}</Label>
        <Select :model-value="selectedPattern" @update:model-value="setSelectedPattern">
          <SelectTrigger id="pattern" class="w-full" :aria-label="$t('Pattern')">
            <SelectValue placeholder="Select a pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{{ $t('No pattern') }}</SelectItem>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>{{ $t('Basic Specified Samples') }}</SelectLabel>
              <SelectItem v-for="option in basicPatternOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>{{ $t('Unicode Range Samples') }}</SelectLabel>
              <SelectItem v-for="option in unicodePatternOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>{{ $t('Custom Text Samples') }}</SelectLabel>
              <SelectItem v-for="option in customTextOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label for="usage-method">{{ $t('Use Chars') }}</Label>
        <Select :model-value="usageMethod" @update:model-value="setUsageMethod">
          <SelectTrigger id="usage-method" class="w-full" :aria-label="$t('Use Chars')">
            <SelectValue placeholder="Select Usage Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in usageOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label for="text-length">{{ $t('Text Length') }}</Label>
        <Input
          id="text-length"
          :model-value="textLength"
          type="number"
          :min="LIMITS.TEXT_LENGTH.MIN"
          :max="LIMITS.TEXT_LENGTH.MAX"
          class="w-full"
          :aria-label="$t('Text Length')"
          @update:model-value="(value) => (textLength = Number(value))"
        />
      </div>

      <div class="space-y-2">
        <Label for="line-break">{{ $t('Line Break') }}</Label>
        <Select :model-value="lineBreakValue" @update:model-value="setLineBreak">
          <SelectTrigger id="line-break" class="w-full" :aria-label="$t('Line Break')">
            <SelectValue placeholder="Select Line Break" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in lineBreakOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <Label for="each-line">{{ $t('Each Line') }}</Label>
        <Input
          id="each-line"
          :model-value="eachLine"
          type="number"
          :min="LIMITS.EACH_LINE.MIN"
          :max="LIMITS.EACH_LINE.MAX"
          :disabled="!lineBreak"
          class="w-full"
          :aria-label="$t('Each Line')"
          @update:model-value="(value) => (eachLine = Number(value))"
        />
      </div>

      <div class="space-y-2">
        <Label for="end-of-line">{{ $t('End of Line') }}</Label>
        <Select :model-value="endOfLine" :disabled="!lineBreak" @update:model-value="setEndOfLine">
          <SelectTrigger id="end-of-line" class="w-full" :aria-label="$t('End of Line')">
            <SelectValue placeholder="Select End of Line" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in endOfLineOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Selected candidate characters -->
    <div class="ml-1">
      <p class="text-sm text-muted-foreground">{{ $t('Selected Candidate Characters') }}: {{ selectedCharCount }}</p>
    </div>

    <!-- Buttons -->
    <div class="mt-4 flex justify-center gap-2">
      <Button variant="secondary" :aria-label="$t('Generate')" @click="generateText">{{ $t('Generate') }}</Button>
      <Button :disabled="!generatedText" :aria-label="$t('Copy')" @click="copyText">{{ $t('Copy') }}</Button>
      <Button variant="outline" :aria-label="$t('Clear')" @click="clearText">{{ $t('Clear') }}</Button>
    </div>

    <!-- Generated Text -->
    <div v-if="generatedText" class="flex flex-col">
      <Separator class="my-6" />
      <Textarea
        v-model="generatedText"
        :rows="2"
        class="max-h-64 overflow-y-auto"
        :aria-label="$t('Generated Text')"
        :wrap="noWrap ? 'off' : 'soft'"
      />
      <div class="mt-2 flex items-center gap-2">
        <Checkbox id="no-wrap" :model-value="noWrap" @update:model-value="(checked) => (noWrap = checked === true)" />
        <Label for="no-wrap">{{ $t('No Wrap') }}</Label>
      </div>
    </div>
  </BasePageContainer>
</template>

<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import { ChevronDownIcon, MinusIcon } from '@lucide/vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

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
const lineBreakValue = computed(() => (lineBreak.value ? 'break' : 'none'));

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

const usageOptions: SelectOption[] = [
  { value: 'random', label: $t('Randomly') },
  { value: 'ascending', label: $t('Unicode Ascending') },
  { value: 'descending', label: $t('Unicode Descending') },
];

const lineBreakOptions = [
  { value: 'none', label: $t('No line break') },
  { value: 'break', label: $t('Line break') },
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
    toast.error($t('Failed to load character data') + `: ${error}`);
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

const setSelectedPattern = (value: AcceptableValue): void => {
  const pattern = String(value);
  selectedPattern.value = pattern;
  applyPatternSelection(pattern);
};

const setUsageMethod = (value: AcceptableValue): void => {
  if (value === 'random' || value === 'ascending' || value === 'descending') {
    usageMethod.value = value;
  }
};

const setEndOfLine = (value: AcceptableValue): void => {
  if (value === 'lf' || value === 'cr' || value === 'crlf') {
    endOfLine.value = value;
  }
};

const setLineBreak = (value: AcceptableValue): void => {
  lineBreak.value = value === 'break';
};

const toggleCharacterType = (value: string, checked: boolean): void => {
  if (checked) {
    if (!charTypesList.value.includes(value)) {
      charTypesList.value.push(value);
    }
    return;
  }

  charTypesList.value = charTypesList.value.filter((characterType) => characterType !== value);
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
    toast.warning($t('Please select character types first'));
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
    toast.success($t('Copied to clipboard'));
  } catch (error) {
    toast.error($t('Failed to copy text') + `: ${error}`);
  }
};

const clearText = (): void => {
  generatedText.value = '';
};
</script>
