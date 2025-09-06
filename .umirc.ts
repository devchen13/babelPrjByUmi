import { defineConfig } from 'umi'
import globalConfig from './GlobalConfig'

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/docs', component: 'docs' },
  ],
  npmClient: 'npm',
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
    '@assets': require('path').resolve(__dirname, 'src/assets'),
    '@components': require('path').resolve(__dirname, 'src/components'),
    '@pages': require('path').resolve(__dirname, 'src/pages'),
    '@utils': require('path').resolve(__dirname, 'src/utils'),
    '@layouts': require('path').resolve(__dirname, 'src/layouts'),
    '@constants': require('path').resolve(__dirname, 'src/constants'),
    '@GlobalConfig': require('path').resolve(__dirname, 'GlobalConfig'),
  },
  proxy: {
    '/api': {
      target: globalConfig.baseUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    },
  },
})
