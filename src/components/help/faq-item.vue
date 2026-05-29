<script setup lang="ts">
interface Props {
  question: string
  showBorder?: boolean
}

withDefaults(defineProps<Props>(), {
  showBorder: true
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

function onClick() {
  emit('click')
}
</script>

<template>
  <view class="faq-item" :class="{ 'show-border': showBorder }" @click="onClick">
    <view class="question-row">
      <text class="question-text">{{ question }}</text>
      <image
        class="arrow-icon"
        src="/static/arrow-right.png"
        mode="aspectFit"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.faq-item {
  padding: 24rpx 0;
}

.faq-item.show-border {
  border-bottom: 1rpx solid #e0e0e0 !important;
}

.faq-item:last-child {
  border-bottom: none;
}

.question-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
}

.arrow-icon {
  width: 16rpx;
  height: 16rpx;
  margin-left: 16rpx;
}
</style>
