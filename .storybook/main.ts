import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const config = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|ts|jsx|tsx)'],
  addons: ['@storybook/addon-essentials'],
  viteFinal: (config) => {
    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
    })
  },
}

export default config
