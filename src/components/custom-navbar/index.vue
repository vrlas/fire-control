<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 页面标题 */
  title?: string
  /** 标题颜色 */
  titleColor?: string
  /** 导航栏背景色，默认透明 */
  bgColor?: string
  /** 是否显示返回按钮，默认显示 */
  showBack?: boolean
  /** 返回按钮图标路径 */
  backIcon?: string
  /** 返回按钮图标颜色 (当使用默认图标时生效) */
  backIconColor?: 'black' | 'white'
  /** 是否显示底部边框 */
  showBorder?: boolean
  /** 边框颜色 */
  borderColor?: string
  /** 自定义左侧内容 */
  customLeft?: boolean
  /** 自定义右侧内容 */
  customRight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  titleColor: '#3B3B3B',
  bgColor: 'transparent',
  showBack: true,
  backIcon: '/static/image/back.png',
  backIconColor: 'black',
  showBorder: false,
  borderColor: '#E5E5E5',
  customLeft: false,
  customRight: false
})

const emit = defineEmits<{
  /** 点击返回按钮 */
  (e: 'back'): void
  /** 点击标题 */
  (e: 'clickTitle'): void
}>()

// 获取系统信息
const systemInfo = uni.getSystemInfoSync()
const statusBarHeight = systemInfo.statusBarHeight || 0
const navBarHeight = 44

// 计算导航栏总高度
const totalHeight = computed(() => statusBarHeight + navBarHeight)

// 导航栏样式
const navbarStyle = computed(() => ({
  paddingTop: `${statusBarHeight}px`,
  backgroundColor: props.bgColor,
  borderBottom: props.showBorder ? `1px solid ${props.borderColor}` : 'none'
}))

// 标题样式
const titleStyle = computed(() => ({
  color: props.titleColor
}))

// 返回按钮样式
const backIconStyle = computed(() => {
  if (props.backIconColor === 'white') {
    return { filter: 'brightness(0) invert(1)' }
  }
  return {}
})

// 处理返回
function handleBack() {
  emit('back')
  // 如果没有自定义返回逻辑，默认返回上一页
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/home/index' })
  }
}

// 点击标题
function handleClickTitle() {
  emit('clickTitle')
}

// 暴露高度供父组件使用
defineExpose({
  totalHeight,
  statusBarHeight,
  navBarHeight
})
</script>

<template>
  <view class="custom-navbar" :style="navbarStyle">
    <view class="nav-content" :style="{ height: `${navBarHeight}px` }">
      <!-- 左侧区域 -->
      <view class="nav-left">
        <slot name="left">
          <view v-if="showBack && !customLeft" class="back-btn" @click="handleBack">
            <image
              :src="backIcon"
              class="back-icon"
              mode="aspectFit"
              :style="backIconStyle"
            />
          </view>
        </slot>
      </view>

      <!-- 中间标题区域 -->
      <view class="nav-center" @click="handleClickTitle">
        <slot name="center">
          <text v-if="title" class="nav-title" :style="titleStyle">
            {{ title }}
          </text>
        </slot>
      </view>

      <!-- 右侧区域 -->
      <view class="nav-right">
        <slot name="right">
          <view v-if="!customRight" class="placeholder" />
        </slot>
      </view>
    </view>
  </view>

  <!-- 占位元素，防止内容被导航栏遮挡 -->
  <view class="navbar-placeholder" :style="{ height: `${totalHeight}px` }" />
</template>

<style lang="scss" scoped>
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.nav-left,
.nav-right {
  width: 100rpx;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 500;
}

.placeholder {
  width: 60rpx;
  height: 60rpx;
}

.navbar-placeholder {
  width: 100%;
}
</style>
