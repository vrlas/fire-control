<script setup lang="ts">
import { computed } from 'vue'
import FaqItem from './faq-item.vue'

interface FAQ {
  id: string | number
  question: string
  answer: string
}

interface Props {
  list: FAQ[]
  total: number
  isExpanded: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'clickItem', item: FAQ): void
  (e: 'expandAll'): void
}>()

// 是否需要显示展开全部按钮（总数大于3且未展开）
const showExpandBtn = computed(() => {
  return props.total > 3 && !props.isExpanded
})

function onClickItem(item: FAQ) {
  emit('clickItem', item)
}

function onExpandAll() {
  emit('expandAll')
}
</script>

<template>
  <view class="faq-list">
    <view class="list-container">
      <FaqItem v-for="(item, index) in props.list" :key="item.id" :question="item.question"
        :show-border="index < props.list.length - 1" @click="onClickItem(item)" />
    </view>
    <view v-if="showExpandBtn" class="expand-btn" @click="onExpandAll">
      <text class="expand-text">展开全部</text>
      <image class="expand-icon" src="/static/aboutRecycle/arrowToDown1@3x.png" mode="aspectFit" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.faq-list {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx;
  padding: 0 24rpx;
}

.list-container {
  padding: 0;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #e0e0e0;
}

.expand-text {
  font-size: 26rpx;
  color: #999;
  margin-right: 4rpx;
}

.expand-icon {
  width: 20rpx;
  height: 20rpx;
}
</style>
