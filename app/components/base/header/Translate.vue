<template>
  <el-dropdown>
    <span>
      <IconsTranslateRounded class="header-language-icon" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="locale in availableLocales" :key="locale.code">
          <NuxtLink :to="switchLocalePath(locale.code)" class="header-language-link">{{ locale.name }}</NuxtLink>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
const { locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const availableLocales = computed(() => locales.value);
</script>
