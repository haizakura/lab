<template>
  <div class="page">
    <Card :class="cardClass">
      <CardHeader>
        <CardTitle class="card-header-title">
          <AppIcon :name="icon" class="size-5" />
          <span>{{ title }}</span>
        </CardTitle>
      </CardHeader>

      <CardContent class="flex flex-col">
        <slot></slot>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const props = defineProps<{
  icon: string;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'x-large';
}>();

const cardClass = computed(() => {
  let classNames = 'm-auto w-[90dvw]';
  switch (props.size || 'medium') {
    case 'small':
      classNames += ' sm:w-sm md:w-md lg:w-lg';
      break;
    case 'medium':
      classNames += ' sm:w-md md:w-lg lg:w-xl';
      break;
    case 'large':
      classNames += ' sm:w-lg md:w-xl lg:w-2xl';
      break;
    case 'x-large':
      classNames += ' sm:w-xl md:w-2xl lg:w-3xl';
      break;
  }
  return classNames;
});
</script>
