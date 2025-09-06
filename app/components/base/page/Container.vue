<template>
  <div class="page">
    <el-card :class="cardClass">
      <template #header>
        <div class="card-header">
          <div class="card-header-title">
            <Icon :name="icon" />
            <span>{{ title }}</span>
          </div>
        </div>
      </template>

      <div class="flex flex-col">
        <slot></slot>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'x-large';
}>();

const cardClass = computed(() => {
  switch (props.size || 'medium') {
    case 'small':
      return 'm-auto sm:w-sm md:w-md lg:w-lg';
    case 'medium':
      return 'm-auto sm:w-md md:w-lg lg:w-xl';
    case 'large':
      return 'm-auto w-[90dvw] sm:w-lg md:w-xl lg:w-2xl';
    case 'x-large':
      return 'm-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl';
  }
});
</script>
