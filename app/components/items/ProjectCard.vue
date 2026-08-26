<template>
  <UCard class="card transition-shadow hover:shadow-md">
    <template #header>
      <div class="card-header cursor-pointer" @click="goTo(name)">
        <div class="card-header-title text-content-primary">
          <UIcon :name="icon" />
          <span>{{ $t(title) }}</span>
        </div>
      </div>
    </template>
    <div class="card-body">
      <p class="line-clamp-2">{{ $t(desc) }}</p>
    </div>
    <div class="my-1"></div>
    <div class="card-bottom">
      <button type="button" class="cursor-pointer text-left text-sm text-info" @click="goTo(name)">
        {{ baseUrl }}{{ path }}
      </button>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const baseUrl = useAppConfig().baseUrl;

const goTo = (name: string) => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute({ name: name });
  navigateTo(route);
};
</script>
