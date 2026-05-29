<script setup lang="ts">
withDefaults(defineProps<{ desc?: string }>(), { desc: '暂无数据' })
</script>

<template>
  <view class="w-full flex flex-col items-center">
    <image class="h-360rpx w-360rpx" src="/static/image/no-data.png" mode="aspectFit" />
    <span class="text-28rpx text-#999">{{ desc }}</span>
  </view>
</template>