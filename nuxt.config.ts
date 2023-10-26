// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/task.scss" as *;',
        }
      }
    }
  },
  modules: ['@pinia/nuxt', 'nuxt-icon'],
})
