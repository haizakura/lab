<template>
  <ClientOnly>
    <UDropdownMenu :items="localeItems">
      <button type="button" class="header-icon" aria-label="Translate">
        <UIcon name="mdi:translate" />
      </button>
    </UDropdownMenu>

    <template #fallback>
      <span class="header-icon" aria-label="Translate">
        <UIcon name="mdi:translate" />
      </span>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
const { locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localeItems = computed(() =>
  locales.value.map((locale) => ({
    label: locale.name,
    to: switchLocalePath(locale.code),
    locale: false,
  })),
);
</script>
