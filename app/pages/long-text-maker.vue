<template>
  <div class="long-text-maker-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-text class="card-header-title" tag="b">🔤 Long Text Maker</el-text>
        </div>
      </template>

      <el-form size="large" label-position="left" label-width="auto">
        <!-- Pattern Selection -->
        <el-form-item label="Sample/Pattern">
          <el-select v-model="selectedPattern" placeholder="Select a pattern" style="width: 100%" @change="onPatternChange">
            <el-option-group label="Basic Specified Samples">
              <el-option
                v-for="item in basicPatternOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
            <el-option-group label="Unicode Range Samples">
              <el-option
                v-for="item in unicodePatternOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
            <el-option-group label="Custom Text Samples">
              <el-option
                v-for="item in customTextOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
            <el-option-group label="Input Check Samples">
              <el-option
                v-for="item in inputCheckOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <!-- Candidate Characters -->
        <el-form-item label="Candidate Characters">
          <div class="checkbox-grid">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-checkbox v-model="charTypes.halfwidthNumbers">Half-width Numbers</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-checkbox v-model="charTypes.halfwidthUppercase">Half-width Letters (Upper)</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-checkbox v-model="charTypes.halfwidthLowercase">Half-width Letters (Lower)</el-checkbox>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mt-2">
              <el-col :span="8">
                <el-checkbox v-model="charTypes.halfwidthSymbols">Half-width Symbols</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-checkbox v-model="charTypes.hiragana">Hiragana</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-checkbox v-model="charTypes.katakana">Katakana</el-checkbox>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mt-2">
              <el-col :span="8">
                <el-checkbox v-model="charTypes.kanjiKana">Kanji Kana</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-checkbox v-model="charTypes.fullwidthAlphanumeric">Full-width Alphanumeric</el-checkbox>
              </el-col>
              <el-col :span="8">
                <el-checkbox v-model="charTypes.fullwidthSymbols">Full-width Symbols</el-checkbox>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mt-2">
              <el-col :span="12">
                <el-checkbox v-model="charTypes.basicKanjiDifferentRadicals">Basic Kanji (Different Radicals)</el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-checkbox v-model="charTypes.basicKanjiWaterRadical">Basic Kanji (Water Radical)</el-checkbox>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mt-2">
              <el-col :span="12">
                <el-checkbox v-model="charTypes.additionalKanjiWaterRadical">Additional Kanji (Water Radical)</el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-checkbox v-model="charTypes.chineseCharacters">Chinese Characters</el-checkbox>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mt-2">
              <el-col :span="12">
                <el-checkbox v-model="charTypes.customUnicodeRange">Custom Unicode Range</el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-checkbox v-model="charTypes.customCharacters">Custom Characters</el-checkbox>
              </el-col>
            </el-row>
          </div>
        </el-form-item>

        <!-- Unicode Range Input -->
        <el-form-item v-if="charTypes.customUnicodeRange" label="Unicode Range">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span>U+</span>
            <el-input 
              v-model="unicodeRange.from" 
              placeholder="0-9A-F (2,5)"
              style="width: 120px;"
              @input="validateUnicodeRange"
            />
            <span>～ U+</span>
            <el-input 
              v-model="unicodeRange.to" 
              placeholder="22FF"
              style="width: 120px;"
              @input="validateUnicodeRange"
            />
          </div>
          <div v-if="unicodeRangeError" class="error-message mt-2">
            <el-text type="danger">{{ unicodeRangeError }}</el-text>
          </div>
        </el-form-item>

        <!-- Custom Characters Input -->
        <el-form-item v-if="charTypes.customCharacters" label="Custom Characters">
          <el-input
            v-model="customCharactersText"
            type="textarea"
            :rows="4"
            placeholder="Enter custom characters here..."
          />
        </el-form-item>

        <!-- Character Usage Method -->
        <el-form-item>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span>Use the above candidate characters</span>
            <el-select v-model="usageMethod" style="width: 200px;">
              <el-option
                v-for="item in usageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>Selected candidate characters: {{selectedCharCount}} characters</span>
          </div>
        </el-form-item>

        <!-- Text Length Settings -->
        <el-form-item label="Text Length">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-input type="number" v-model="textLength" style="width: 120px;" />
            <span>characters (preset values</span>
            <el-select v-model="textLengthPreset" @change="onPresetChange" style="width: 150px;">
              <el-option
                v-for="item in textLengthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>)</span>
          </div>
        </el-form-item>

        <!-- Line Break Settings -->
        <el-form-item label="Line Break">
          <el-select v-model="lineBreakOption" style="width: 200px;">
            <el-option
              v-for="item in lineBreakOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="generateText">Generate Text</el-button>
        <el-button size="large" @click="clearAll">Clear</el-button>
      </div>

      <el-divider v-if="generatedText"></el-divider>

      <!-- Output Textarea -->
      <div v-if="generatedText" class="output-section">
        <el-input
          v-model="generatedText"
          type="textarea"
          :rows="15"
          placeholder="Generated text will appear here..."
          :class="{ 'no-wrap': noTextWrap }"
        />
        <div class="output-options mt-2">
          <el-checkbox v-model="noTextWrap">No text wrap</el-checkbox>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'longTextMaker',
});

import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';

const appConfig = useAppConfig();

useSeoMeta({
  title: appConfig.itemConfig.longTextMaker.title,
  description: appConfig.itemConfig.longTextMaker.desc,
});

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

const inputCheckOptions = [
  { value: 'unicodeFromEmpty', label: 'Unicode Range, From not entered' },
  { value: 'unicodeFromInvalid', label: 'Unicode Range, From insufficient digits' },
  { value: 'unicodeToInvalid', label: 'Unicode Range, To format incorrect' },
  { value: 'unicodeFromGreaterThanTo', label: 'Unicode Range, From greater than To' },
];

// Character types
const charTypes = ref({
  halfwidthNumbers: true,
  halfwidthUppercase: true,
  halfwidthLowercase: true,
  halfwidthSymbols: false,
  hiragana: false,
  katakana: false,
  kanjiKana: false,
  fullwidthAlphanumeric: false,
  fullwidthSymbols: false,
  basicKanjiDifferentRadicals: false,
  basicKanjiWaterRadical: false,
  additionalKanjiWaterRadical: false,
  chineseCharacters: false,
  customUnicodeRange: false,
  customCharacters: false,
});

// Unicode range
const unicodeRange = ref({
  from: '',
  to: ''
});
const unicodeRangeError = ref('');

// Custom characters
const customCharactersText = ref('');

// Usage method
const usageMethod = ref('random');
const usageOptions = [
  { value: 'random', label: 'Use randomly' },
  { value: 'sequential', label: 'Use sequentially' },
  { value: 'repeat', label: 'Use repeatedly' },
];

// Text length
const textLength = ref(1000);
const textLengthPreset = ref('1000');
const textLengthOptions = [
  { value: '100', label: '100 characters' },
  { value: '500', label: '500 characters' },
  { value: '1000', label: '1000 characters' },
  { value: '5000', label: '5000 characters' },
  { value: '10000', label: '10000 characters' },
];

// Line break settings
const lineBreakOption = ref('none');
const lineBreakOptions = [
  { value: 'none', label: 'No line break' },
  { value: 'every50', label: 'Every 50 characters' },
  { value: 'every100', label: 'Every 100 characters' },
  { value: 'everyLine', label: 'Every line' },
];

// Output
const generatedText = ref('');
const noTextWrap = ref(false);

// Character sets
const characterSets = {
  halfwidthNumbers: '0123456789',
  halfwidthUppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  halfwidthLowercase: 'abcdefghijklmnopqrstuvwxyz',
  halfwidthSymbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  hiragana: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  kanjiKana: '一二三四五六七八九十百千万円年月日時分秒人本大小中上下左右前後内外東西南北',
  fullwidthAlphanumeric: '０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
  fullwidthSymbols: '！＠＃＄％＾＆＊（）＿＋－＝［］｛｝｜；：，．＜＞？',
  basicKanjiDifferentRadicals: '木火土金水草竹米糸言足車門雨風',
  basicKanjiWaterRadical: '水江河海湖池波泳洗浴',
  additionalKanjiWaterRadical: '氷泡沸湯温涼清濁深浅広狭',
  chineseCharacters: '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严',
};

// Predefined text samples
const textSamples = {
  irohaPoem: 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす',
  roundCharacters: '。◯○●◦◉◎⚪⚫🔘🔵🔴⭕⭐💫⭐🌟✨💥💢💫💤💦💧💨',
};

// Computed property for selected character count
const selectedCharCount = computed(() => {
  let count = 0;
  Object.entries(charTypes.value).forEach(([key, selected]) => {
    if (selected && characterSets[key as keyof typeof characterSets]) {
      count += characterSets[key as keyof typeof characterSets].length;
    }
  });
  
  // Add custom characters count
  if (charTypes.value.customCharacters && customCharactersText.value) {
    count += customCharactersText.value.length;
  }
  
  // Add unicode range count (approximate)
  if (charTypes.value.customUnicodeRange && unicodeRange.value.from && unicodeRange.value.to) {
    const fromCode = parseInt(unicodeRange.value.from, 16);
    const toCode = parseInt(unicodeRange.value.to, 16);
    if (!isNaN(fromCode) && !isNaN(toCode) && toCode >= fromCode) {
      count += toCode - fromCode + 1;
    }
  }
  
  return count;
});

// Pattern change handler
const onPatternChange = () => {
  // Reset all checkboxes first
  Object.keys(charTypes.value).forEach(key => {
    charTypes.value[key as keyof typeof charTypes.value] = false;
  });

  // Set appropriate checkboxes and custom text based on pattern
  switch (selectedPattern.value) {
    case 'halfwidthAlphanumeric':
      charTypes.value.halfwidthNumbers = true;
      charTypes.value.halfwidthUppercase = true;
      charTypes.value.halfwidthLowercase = true;
      break;
    case 'ascii':
      charTypes.value.halfwidthNumbers = true;
      charTypes.value.halfwidthUppercase = true;
      charTypes.value.halfwidthLowercase = true;
      charTypes.value.halfwidthSymbols = true;
      break;
    case 'hiraganaKatakana':
      charTypes.value.hiragana = true;
      charTypes.value.katakana = true;
      break;
    case 'kanjiDifferentRadical':
      charTypes.value.basicKanjiDifferentRadicals = true;
      break;
    case 'kanjiWaterRadical':
      charTypes.value.basicKanjiWaterRadical = true;
      break;
    case 'kanjiWoodRadical':
      charTypes.value.customCharacters = true;
      customCharactersText.value = '木林森枝葉根幹樹枯朽';
      break;
    case 'braillePatterns':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '2800';
      unicodeRange.value.to = '28FF';
      break;
    case 'mathematicalSymbols':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '2200';
      unicodeRange.value.to = '22FF';
      break;
    case 'latinExtendedA':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '0100';
      unicodeRange.value.to = '017F';
      break;
    case 'unifiedCanadianAboriginal':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '1400';
      unicodeRange.value.to = '167F';
      break;
    case 'irohaPoem':
      charTypes.value.customCharacters = true;
      customCharactersText.value = textSamples.irohaPoem;
      break;
    case 'roundCharacters':
      charTypes.value.customCharacters = true;
      customCharactersText.value = textSamples.roundCharacters;
      break;
    // Input check samples - these simulate error conditions
    case 'unicodeFromEmpty':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '';
      unicodeRange.value.to = '22FF';
      break;
    case 'unicodeFromInvalid':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '0A';
      unicodeRange.value.to = '22FF';
      break;
    case 'unicodeToInvalid':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '0100';
      unicodeRange.value.to = 'GGGG';
      break;
    case 'unicodeFromGreaterThanTo':
      charTypes.value.customUnicodeRange = true;
      unicodeRange.value.from = '22FF';
      unicodeRange.value.to = '0100';
      break;
  }
};

const validateUnicodeRange = () => {
  unicodeRangeError.value = '';
  
  if (charTypes.value.customUnicodeRange) {
    if (!unicodeRange.value.from) {
      unicodeRangeError.value = 'From field is required';
      return;
    }
    
    if (unicodeRange.value.from.length < 2) {
      unicodeRangeError.value = 'From field must be at least 2 characters';
      return;
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(unicodeRange.value.from)) {
      unicodeRangeError.value = 'From field must contain only hexadecimal characters';
      return;
    }
    
    if (unicodeRange.value.to && !/^[0-9A-Fa-f]+$/.test(unicodeRange.value.to)) {
      unicodeRangeError.value = 'To field must contain only hexadecimal characters';
      return;
    }
    
    if (unicodeRange.value.from && unicodeRange.value.to) {
      const fromCode = parseInt(unicodeRange.value.from, 16);
      const toCode = parseInt(unicodeRange.value.to, 16);
      
      if (fromCode > toCode) {
        unicodeRangeError.value = 'From value cannot be greater than To value';
        return;
      }
    }
  }
};

const onPresetChange = () => {
  textLength.value = parseInt(textLengthPreset.value);
};

const generateText = () => {
  if (unicodeRangeError.value) {
    ElMessage.error('Please fix Unicode range errors first');
    return;
  }

  // Collect all selected characters
  let availableChars = '';
  
  Object.entries(charTypes.value).forEach(([key, selected]) => {
    if (selected && characterSets[key as keyof typeof characterSets]) {
      availableChars += characterSets[key as keyof typeof characterSets];
    }
  });

  // Add custom characters
  if (charTypes.value.customCharacters && customCharactersText.value) {
    availableChars += customCharactersText.value;
  }

  // Add unicode range characters
  if (charTypes.value.customUnicodeRange && unicodeRange.value.from && unicodeRange.value.to) {
    const fromCode = parseInt(unicodeRange.value.from, 16);
    const toCode = parseInt(unicodeRange.value.to, 16);
    
    if (!isNaN(fromCode) && !isNaN(toCode) && toCode >= fromCode) {
      for (let i = fromCode; i <= toCode; i++) {
        availableChars += String.fromCodePoint(i);
      }
    }
  }

  if (availableChars.length === 0) {
    ElMessage.warning('Please select at least one character type.');
    return;
  }

  let result = '';
  
  for (let i = 0; i < textLength.value; i++) {
    if (usageMethod.value === 'random') {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      result += availableChars[randomIndex];
    } else if (usageMethod.value === 'sequential') {
      result += availableChars[i % availableChars.length];
    } else if (usageMethod.value === 'repeat') {
      result += availableChars[0];
    }
  }

  // Apply line breaks if specified
  if (lineBreakOption.value !== 'none') {
    const breakInterval = lineBreakOption.value === 'every50' ? 50 :
                         lineBreakOption.value === 'every100' ? 100 : 
                         lineBreakOption.value === 'everyLine' ? 80 : 0;
    
    if (breakInterval > 0) {
      let formatted = '';
      for (let i = 0; i < result.length; i += breakInterval) {
        formatted += result.slice(i, i + breakInterval) + '\n';
      }
      result = formatted.trim();
    }
  }

  generatedText.value = result;
  ElMessage.success(`Generated ${textLength.value} character text successfully.`);
};

const clearAll = () => {
  generatedText.value = '';
  selectedPattern.value = 'halfwidthAlphanumeric';
  textLength.value = 1000;
  textLengthPreset.value = '1000';
  lineBreakOption.value = 'none';
  usageMethod.value = 'random';
  noTextWrap.value = false;
  customCharactersText.value = '';
  unicodeRange.value.from = '';
  unicodeRange.value.to = '';
  unicodeRangeError.value = '';
  onPatternChange(); // Reset character selections
  ElMessage.info('Settings cleared.');
};

// Watch for pattern changes
watch(selectedPattern, onPatternChange);

// Watch for unicode range changes
watch([() => unicodeRange.value.from, () => unicodeRange.value.to], validateUnicodeRange);
</script>

<style lang="css" scoped>
.long-text-maker-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.box-card {
  @media (min-width: 768px) {
    width: 50em;
    margin: auto;
  }
  @media (max-width: 767px) {
    margin: auto;
    width: 100%;
  }
}

.card-header-title {
  color: #000;
  font-size: 1.5em;
}

.checkbox-grid {
  width: 100%;
  
  .el-row {
    margin-bottom: 8px;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
}

.output-section {
  .no-wrap textarea {
    white-space: nowrap;
    overflow-x: auto;
  }
}

.output-options {
  display: flex;
  justify-content: flex-start;
}

.overview-section {
  .overview-list {
    margin-top: 12px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
}

.mt-2 {
  margin-top: 8px;
}
</style>
