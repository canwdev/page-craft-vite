import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import {fileURLToPath, URL} from 'url'
import {VitePWA} from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    BUILD_TIMESTAMP: Date.now(),
  },
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  esbuild: {
    supported: {
      // https://stackoverflow.com/questions/72618944/get-error-to-build-my-project-in-vite-top-level-await-is-not-available-in-the
      'top-level-await': true, //browsers can handle top-level-await features
    },
  },
  build: {
    minify: 'terser',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/_variables.scss";`,
      },
    },
  },
  plugins: [
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.png', 'favicon-192.png', 'favicon-512.png'],
    //   manifest: {
    //     name: 'PageCraft',
    //     short_name: 'PageCraft',
    //     description: 'Web page rapid generation tool',
    //     theme_color: '#83B253',
    //     icons: [
    //       {
    //         src: 'favicon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: 'favicon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
    vue(),
    // VueDevTools(),
    AutoImport({
      dts: './src/auto-import.d.ts',
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
        'pinia',
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  // 强制预构建插件包
  optimizeDeps: {
    exclude: ['@humanfs/web'],
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
    ],
  },
})
