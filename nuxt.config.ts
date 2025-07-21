// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@element-plus/nuxt'],
  css: ['@/assets/style.scss'],
  vite: {
    ssr: {
      noExternal: ['log4js', 'dayjs'],
    },
    optimizeDeps: {
      include: ['dayjs'],
    },
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
