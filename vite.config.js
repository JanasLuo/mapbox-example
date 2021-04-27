/*
 * @Date: 2021-04-23 10:10:35
 * @LastEditors: mark
 * @LastEditTime: 2021-04-27 10:33:20
 * @Description: Do not edit
 */
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vitePluginImp from 'vite-plugin-imp'
import path from 'path'
import fs from 'fs'
import lessToJs from 'less-vars-to-js'
import config from './config/index'
// https://vitejs.dev/config/

const themeVariables = lessToJs(
  fs.readFileSync(path.resolve(__dirname, './config/variables.less'), 'utf8')
)
const env = process.argv[process.argv.length - 1]
const base = config[env]
export default defineConfig({
  base: base.cdn,
  plugins: [
    reactRefresh(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/lib/${name}/style/index.less`
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themeVariables
      }
    }
  },
  server: {
    port: 3001, // 开发环境启动的端口
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值，这里我们为了测试，写了新蜂商城的请求地址
        target: 'http://47.99.134.126:28019/api/v1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      },
      '/darkblue_whhb': {
        target: 'http://127.0.0.1:8080/darkblue_whhb',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/darkblue_whhb/, '') // 将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'), // 根路径
      '@': path.resolve(__dirname, 'src') // src 路径
    }
  }
})
