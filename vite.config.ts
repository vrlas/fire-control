import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'

export default async () => {
  // 动态导入 ESM-only 的 unocss/vite 包
  const { default: unocss } = await import('unocss/vite')
  return defineConfig({
    plugins: [uni(), unocss()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api']
        }
      }
    }
  })
}
