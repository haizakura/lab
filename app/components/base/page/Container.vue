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
  size?: 'small' | 'medium' | 'large';
}>();

const cardClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'm-auto sm:w-sm';
    case 'medium':
      return 'm-auto sm:w-md';
    case 'large':
      return 'm-auto w-[90dvw] sm:w-xl md:w-2xl lg:w-3xl';
    default:
      return 'm-auto sm:w-md';
  }
});
</script>
