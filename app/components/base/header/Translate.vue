<template>
  <ClientOnly>
    <DropdownMenu v-model:open="open" :modal="false">
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="header-icon"
          aria-label="Translate"
          title="Translate"
          @click.capture="handleTriggerClick"
          @pointerenter="openMenu"
          @pointerleave="closeMenuSoon"
        >
          <LanguagesIcon class="size-5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        :side-offset="8"
        class="z-50 w-auto min-w-44 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        @pointerenter="clearCloseTimer"
        @pointerleave="closeMenuSoon"
        @open-auto-focus="handleOpenAutoFocus"
      >
        <DropdownMenuRadioGroup :model-value="locale" @update:model-value="updateLanguage">
          <DropdownMenuRadioItem
            v-for="language in languageOptions"
            :key="language.code"
            :value="language.code"
            :text-value="language.name"
            class="relative flex cursor-pointer items-center rounded-lg py-2.5 pr-9 pl-3 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground [&>[data-slot=dropdown-menu-radio-item-indicator]]:right-3 [&>[data-slot=dropdown-menu-radio-item-indicator]]:text-primary"
          >
            {{ language.name }}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const { locale, setLocale } = useI18n();
const open = ref(false);
const openedByHover = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh-CN', name: '简体中文' },
] as const;

type AppLocale = (typeof languageOptions)[number]['code'];

const clearCloseTimer = () => {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = undefined;
};

const supportsHover = (event: PointerEvent) =>
  event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches;

const openMenu = (event: PointerEvent) => {
  if (!supportsHover(event)) return;
  clearCloseTimer();
  openedByHover.value = true;
  open.value = true;
};

const closeMenuSoon = (event: PointerEvent) => {
  if (!supportsHover(event) || !openedByHover.value) return;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    open.value = false;
  }, 160);
};

const handleTriggerClick = () => {
  if (openedByHover.value && open.value) open.value = false;
  openedByHover.value = false;
};

const updateLanguage = (value: unknown) => {
  if (languageOptions.some((language) => language.code === value)) void setLocale(value as AppLocale);
};

const handleOpenAutoFocus = (event: Event) => {
  if (openedByHover.value) event.preventDefault();
};

watch(open, (value) => {
  if (!value) openedByHover.value = false;
});

onBeforeUnmount(clearCloseTimer);
</script>
