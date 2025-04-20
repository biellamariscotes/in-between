import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'

// Register Element Plus globally for Storybook
setup((app) => {
  app.use(ElementPlus)
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
