<template>
  <ClientOnly>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button type="button" class="header-icon" aria-label="Translate">
          <LanguagesIcon class="size-5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem v-for="locale in localeItems" :key="locale.code" as-child>
          <NuxtLink :to="locale.to" class="w-full">
            {{ locale.name }}
          </NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <template #fallback>
      <span class="header-icon" aria-label="Translate">
        <LanguagesIcon class="size-5" aria-hidden="true" />
      </span>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { LanguagesIcon } from '@lucide/vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const { locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localeItems = computed(() =>
  locales.value.map((locale) => ({
    code: locale.code,
    name: locale.name,
    to: switchLocalePath(locale.code),
  })),
);
</script>
