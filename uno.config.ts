import { defineConfig, transformerDirectives } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [
    // 启用@apply/@screen/theme()等css指令
    transformerDirectives()
  ],
  shortcuts: [
    {
      'u-center': 'flex justify-center items-center',
      'u-center-between': 'flex justify-between items-center',
      'u-safe': 'pt-[calc(var(--status-bar-height)+10rpx+32rpx)] pb-[var(--window-bottom)]',
      'u-cover': 'bg-cover bg-center bg-no-repeat',
      'u-bg': 'bg-[linear-gradient(270deg,_#67AC58_0%,_#0165B2_100%)]',
      'u-border': 'border-2rpx border-solid border-#000',
      'u-border-b': 'border-b-1rpx border-b-solid border-b-#e5e5e588',
      'u-img': 'w-full!',
      'u-card': 'rounded-20rpx bg-white p-20rpx w-full box-border',
      'u-card-np': 'rounded-20rpx bg-white',
      'u-shadow': 'shadow-[0_8rpx_20rpx_#ccc4]',
      'u-copy': 'bg-#43cf7c22 text-#43cf7c rounded-8rpx px-12rpx py-4rpx text-24rpx'
    }
  ]
})