<script setup lang="ts">
interface Category {
  id: string | number
  name: string
}

interface Props {
  categories: Category[]
  activeId?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  activeId: ''
})

const emit = defineEmits<{
  (e: 'change', category: Category): void
}>()

function onSelect(category: Category) {
  if (category.id !== props.activeId) {
    emit('change', category)
  }
}
</script>

<template>
  <view class="category-tabs">
    <scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
      <view class="tabs-list">
        <view
          v-for="item in categories"
          :key="item.id"
          class="tab-item"
          :class="{ active: item.id === activeId }"
          @click="onSelect(item)"
        >
          <text class="tab-text">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.category-tabs {
  padding: 20rpx 30rpx;
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #4caf50;
  border-radius: 12rpx;
  padding: 8rpx;
  gap: 8rpx;
}

.tab-item {
  flex: 1;
  padding: 10rpx 0;
  background: transparent;
  border-radius: 8rpx;
  transition: all 0.3s;
  text-align: center;
}

.tab-item.active {
  background: #fff;
}

.tab-text {
  font-size: 26rpx;
  color: #fff;
}

.tab-item.active .tab-text {
  color: #333;
  font-weight: 500;
}
</style>
