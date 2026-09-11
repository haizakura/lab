<template>
  <ClientOnly>
    <button
      type="button"
      class="header-icon"
      :aria-label="`${$t('Theme')}: ${currentLabel}`"
      :title="currentLabel"
      @click="cycleColorMode"
    >
      <component :is="currentIcon" class="size-5" aria-hidden="true" />
    </button>

    <template #fallback>
      <span class="header-icon" :aria-label="$t('Theme')">
        <MonitorCogIcon class="size-5" aria-hidden="true" />
      </span>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { MonitorCogIcon, MoonIcon, SunIcon } from '@lucide/vue';

type ColorModePreference = 'system' | 'light' | 'dark';

const colorMode = useColorMode();
const { t } = useI18n();
const preferences: ColorModePreference[] = ['system', 'light', 'dark'];

const currentPreference = computed<ColorModePreference>(() => {
  if (colorMode.preference === 'light' || colorMode.preference === 'dark') {
    return colorMode.preference;
  }

  return 'system';
});

const currentIcon = computed(() => {
  switch (currentPreference.value) {
    case 'light':
      return SunIcon;
    case 'dark':
      return MoonIcon;
    default:
      return MonitorCogIcon;
  }
});

const currentLabel = computed(() => {
  switch (currentPreference.value) {
    case 'light':
      return t('Light');
    case 'dark':
      return t('Dark');
    default:
      return t('System');
  }
});

const cycleColorMode = () => {
  const currentIndex = preferences.indexOf(currentPreference.value);
  colorMode.preference = preferences[(currentIndex + 1) % preferences.length] ?? 'system';
};
</script>
