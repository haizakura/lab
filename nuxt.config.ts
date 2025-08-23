// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ['@element-plus/nuxt', '@nuxtjs/i18n', '@unocss/nuxt', '@nuxt/icon'],
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
  },
  vite: {
    ssr: {
      noExternal: ['dayjs'],
    },
    optimizeDeps: {
      include: ['dayjs'],
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json', language: 'en' },
      { code: 'ja', name: '日本語', file: 'ja.json', language: 'ja' },
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json', language: 'zh' },
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
