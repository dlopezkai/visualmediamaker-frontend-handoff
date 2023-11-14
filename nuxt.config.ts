import { createResolver } from "@nuxt/kit";
import vuetify from "vite-plugin-vuetify";

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  experimental: {
    inlineSSRStyles: false,
  },
  css: ['vuetify/lib/styles/main.sass','@mdi/font/css/materialdesignicons.min.css'],
  typescript: {
    shim: false,
  },
  build: {
    //   extractCSS: false,
    transpile: ["vuetify","@fawmi/vue-google-maps"],
  },
  runtimeConfig: {
    public: { GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyA92xRjp7fUba6yBWvJGBfXZwSswwpIX6w' },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/strapi",
    "nuxt-snackbar"
  ],
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt'
  },
  plugins: [
    "plugins/vueGoogleMaps"
  ],
  app: {
    head: {
      title:
        "Vision Maker Media",
    },
  },
  nitro: {
    serveStatic: true,
  },
  sourcemap: { server: false, client: false },
  devServerHandlers: [],
  hooks: {
    "vite:extendConfig": (config: any) => {
      config.plugins.push(
        vuetify({
          autoImport: true,
          styles: { configFile: resolve("assets/scss/variables.scss") },
        })
      );
    },
  },
  devtools: { enabled: true }
});