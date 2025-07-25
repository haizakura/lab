// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ['@element-plus/nuxt', '@nuxtjs/i18n', '@unocss/nuxt'],
  css: ['@/assets/style.css'],
  vite: {
    ssr: {
      noExternal: ['log4js', 'dayjs'],
    },
    optimizeDeps: {
      include: ['dayjs'],
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
    ],
  },
  app: {
    head: {
      title: 'HAIZAKURA Lab',
      meta: [
        { name: 'description', content: 'HAIZAKURA Lab' },
        { name: 'keywords', content: 'HAIZAKURA, Lab, Tools, Exchange Rate' },
        { name: 'author', content: 'HAIZAKURA' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { charset: 'utf-8' },
      ],
      noscript: [{ textContent: 'JavaScript is required' }],
    },
  },
});
