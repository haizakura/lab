<template>
  <div class="header-container">
    <div class="header-container-item" @click="goBackHome">
      <BaseHeaderLogo />
    </div>

    <div class="header-container-item">
      <BaseHeaderTranslate />
      <span class="mx-2"></span>
      <BaseHeaderBlog />
      <span class="mx-2"></span>
      <BaseHeaderGithub />
    </div>
  </div>
</template>

<script lang="ts" setup>
const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute({ name: 'home' });
  navigateTo(route);
};
</script>
