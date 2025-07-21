<template>
  <div class="header-container">
    <el-text tag="b" class="lab-title" @click="goBackHome">HAIZAKURA Lab</el-text>
    
    <div class="header-right">
      <el-dropdown>
        <span>
          <i class="el-icon language-icon">
            <svg viewBox="0 0 24 24" width="1.5rem" height="1.5rem">
              <path d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z">
              </path>
            </svg>
          </i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="locale in availableLocales" :key="locale.code">
              <NuxtLink :to="switchLocalePath(locale.code)" class="language-link">{{ locale.name }}</NuxtLink>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const goBackHome = () => {
  const localeRoute = useLocaleRoute();
  const route = localeRoute('/');
  route ? navigateTo(route) : navigateTo('/');
};

const availableLocales = computed(() => locales.value);
</script>

<style lang="css" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.lab-title {
  cursor: pointer;
  color: #000;
  font-size: 1.2rem;
  text-decoration: none;
  line-height: 3rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.language-icon {
  font-size: 1.5rem;
  line-height: 3rem;
  cursor: pointer;
}

.language-link {
  color: #000;
  text-decoration: none;
}
</style>
