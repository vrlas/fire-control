<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/utils'

const props = withDefaults(defineProps<{
  size: 'small' | 'large'
  progress: number
  outerText?: string
  innerText?: string
  isStandBy: number
}>(), {})

const availableHeight = computed(() => `${formatNumber(props.progress)}%`)
</script>

<template>
  <view class="relative flex flex-col">
    <view class="relative rounded-12rpx"
      :class="`${size === 'small' ? 'h-74rpx w-58rpx items-center' : 'h-130rpx w-100rpx items-start'} ${isStandBy ? 'bg-#ED6732' : 'bg-#EDECEC'}`">
      <view class="absolute bottom-0 left-0 w-full rounded-12rpx" :class="isStandBy ? 'bg-#ED6732' : 'bg-#60EB98'"
        :style="{ height: props.progress > 100 ? '100%' : availableHeight }" />
      <view :class="`c-bings-step ${size === 'small' ? 'h-16rpx' : 'h-28rpx'}`">
        <view class="h-full bg-#fffd" :class="size === 'small' ? 'w-29rpx rounded-2rpx' : 'w-50rpx rounded-8rpx'" />
        <view class="h-full bg-#fffd" :class="size === 'small' ? 'w-8rpx rounded-2rpx' : 'w-14rpx rounded-8rpx'" />
      </view>
      <text v-if="isStandBy" class="absolute bottom-0 left-0 right-0 top-0 u-center text-20rpx text-white font-700">
        维护中
      </text>
      <text v-else class="absolute bottom-0 left-0 right-0 top-0 u-center text-18rpx text-white">
        {{ availableHeight }}
      </text>
    </view>
    <view
      v-if="outerText"
      class="mt-4rpx flex u-center text-align-center text-20rpx text-#a6a6a6 -bottom-30rpx"
      style="max-width: 100%; white-space: normal; word-break: break-all; overflow: visible;"
    >
      {{ outerText }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.c-bings-step {
  @apply absolute top-10rpx left-10rpx w-4/5 mx-auto flex justify-between;
}
</style>
