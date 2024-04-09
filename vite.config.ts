import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({mode}) =>{
  //运行模式
  console.log('运行模式', mode);
  //当前路径
  const root = process.cwd();
  const env = loadEnv(mode, root);
  //运行环境
  console.log('运行环境', env);
  const proxy = {
    '^/demoApi/': {
      target: env.BASE_URL,
      changeOrigin: true,
      ws: true,
      rewrite: (path: string) => path.replace(/^\/demoApi/, ''),
    }
  }
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '/images': 'src/assets/images/'
      }
    },
    server: {
      open: true, //项目启动时自动打开浏览器
      port: 3001, //自定义端口
      hmr: true, //开启热加载
      proxy: {
        ...proxy
      }
    },
  }
})
