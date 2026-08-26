<template>
  <ClientOnly>
    <UDropdownMenu :items="colorModeItems">
      <button type="button" class="header-icon" :aria-label="$t('Theme')">
        <UIcon :name="currentIcon" />
      </button>
    </UDropdownMenu>

    <template #fallback>
      <span class="header-icon" :aria-label="$t('Theme')">
        <UIcon name="mdi:theme-light-dark" />
      </span>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
type ColorModePreference = 'system' | 'light' | 'dark';

const colorMode = useColorMode();

const currentIcon = computed(() => {
  switch (colorMode.preference) {
    case 'light':
      return 'mdi:white-balance-sunny';
    case 'dark':
      return 'mdi:weather-night';
    default:
      return 'mdi:theme-light-dark';
  }
});

const setColorMode = (preference: ColorModePreference) => {
  colorMode.preference = preference;
};

const colorModeItems = computed(() => [
  {
    label: $t('System'),
    icon: colorMode.preference === 'system' ? 'mdi:check-circle' : 'mdi:theme-light-dark',
    onSelect: () => setColorMode('system'),
  },
  {
    label: $t('Light'),
    icon: colorMode.preference === 'light' ? 'mdi:check-circle' : 'mdi:white-balance-sunny',
    onSelect: () => setColorMode('light'),
  },
  {
    label: $t('Dark'),
    icon: colorMode.preference === 'dark' ? 'mdi:check-circle' : 'mdi:weather-night',
    onSelect: () => setColorMode('dark'),
  },
]);
</script>
