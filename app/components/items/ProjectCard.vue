<template>
  <Card class="card transition-shadow hover:shadow-md">
    <CardHeader class="cursor-pointer" @click="goTo(name)">
      <CardTitle class="card-header-title text-foreground">
        <AppIcon :name="icon" class="size-5" />
        <span>{{ $t(title) }}</span>
      </CardTitle>
    </CardHeader>
    <CardContent class="card-body">
      <p class="line-clamp-2">{{ $t(desc) }}</p>
    </CardContent>
    <CardFooter class="card-bottom">
      <button type="button" class="cursor-pointer text-left text-sm text-muted-foreground" @click="goTo(name)">
        {{ baseUrl }}{{ path }}
      </button>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
