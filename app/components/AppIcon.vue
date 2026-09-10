<script setup lang="ts">
import type { Component } from 'vue';
import { Braces, CircleDollarSign, CircleHelp, FileJson, Text, Wrench } from '@lucide/vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  name: string;
}>();

const icons: Record<string, Component> = {
  braces: Braces,
  'circle-dollar-sign': CircleDollarSign,
  'file-json': FileJson,
  text: Text,
  wrench: Wrench,
};

const iconComponent = computed(() => icons[props.name] ?? CircleHelp);
</script>

<template>
  <component :is="iconComponent" aria-hidden="true" v-bind="$attrs" />
</template>
