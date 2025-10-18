import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
// import {visualizer} from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd())
  const isProd = mode === 'production'
  console.log('vite config mode', mode)
  return {
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
      // host: '0.0.0.0',
    },
    esbuild: {
      supported: {
        // https://stackoverflow.com/questions/72618944/get-error-to-build-my-project-in-vite-top-level-await-is-not-available-in-the
        'top-level-await': true, // browsers can handle top-level-await features
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/_variables.scss";`,
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
    plugins: [
      vue(),
      // visualizer({
      //   template: 'flamegraph', // 'treemap' | 'sunburst' | 'network' | 'flamegraph'
      //   gzipSize: true,
      //   brotliSize: true,
      //   emitFile: false,
      //   filename: 'visualizer.html', //分析图生成的文件名
      //   open: true, //如果存在本地服务端口，将在打包后自动展示
      // }),

      AutoImport({
        dts: './src/auto-import.d.ts',
        imports: ['vue', 'pinia'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        // 传入空数组表示不要自动添加开发中的组件，所有自定义组件需要手动引入
        dirs: [],
        resolvers: [ElementPlusResolver()],
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
  }
})
