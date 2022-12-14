import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import {visualizer} from "rollup-plugin-visualizer"
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

function pathResolve(dir) {
  return resolve(__dirname, '.', dir)
}
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      Components({
        resolvers: [VantResolver()]
      })
    ],
    server: {
      open: true,//启动时自动打开浏览器
      hmr: true,//开启热更新
      port: '80',
      host: '0.0.0.0',
      cors: true,
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    envPrefix: ['VITE'],
    base: '/',
    define: {
      'process.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
    },
    resolve: {
      // 设置别名路径
      alias: {
        '@': pathResolve('src')
      },
      // 忽略后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build: {
      assetsDir: 'static',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        input: {
          index:resolve(__dirname,"index.html"),
        },
        output: {
          chunkFileNames:'static/js/[name]-[hash].js',
          entryFileNames:"static/js/[name]-[hash].js",
          assetFileNames:"static/[ext]/name-[hash].[ext]"
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport8plugin({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 375, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            exclude: [],
            landscape: false // 是否处理横屏情况
          })
        ]
      },
      preprocessorOptions: {
        scss: {}
      }
    }
  }
})
