<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getBannerByCode } from '@/api/user'

const prop = defineProps(['qrCode'])
defineEmits(['click', 'longPress'])
const list = ref<any>([])

async function fetchData() {
  list.value = (await getBannerByCode(3))?.data || {}
}

function previewQrCode() {
  uni.previewImage({ urls: [prop?.qrCode || list?.value?.[0]] })
}

onMounted(fetchData)
</script>

<template>
  <view class="customer-service">
    <!-- 背景图片 -->
    <image class="bg-image" src="/static/help/help-background.jpg" mode="aspectFill" />

    <!-- 内容层 -->
    <view class="content-wrapper">
      <!-- 上半部分：左侧标题+工作时间，右侧图标 -->
      <view class="top-section">
        <view class="left-section">
          <text class="service-title">在线咨询</text>
          <text class="work-time">人工客服工作时间为 9:00-20:00</text>
          <text class="work-time">如遇咨询高峰期 回复会有延迟</text>
        </view>
        <view class="right-section">
          <image class="service-icon" src="/static/help/wechat-icon.png" mode="aspectFit" />
        </view>
      </view>

      <!-- 中间部分：提示文字 -->
      <view class="middle-section">
        <text class="qr-tip">长按识别二维码 添加人工客服</text>
        <image class="arrow-icon" src="/static/help/arrow.png" mode="aspectFit" />
      </view>

      <!-- 底部：二维码 -->
      <view class="bottom-section">
        <view class="qr-code-box" @click="previewQrCode">
          <image v-if="qrCode || list?.[0]" class="qr-image" :src="qrCode || list?.[0]" mode="aspectFit" show-menu-by-longpress />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.customer-service {
  margin: 30rpx;
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  min-height: 500rpx;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
}

/* 上半部分 */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40rpx;
}

.left-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.service-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #000;
  margin-bottom: 12rpx;
}

.work-time {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.right-section {
  margin-left: 20rpx;
}

.service-icon {
  width: 140rpx;
  height: 140rpx;
}

/* 中间部分 */
.middle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.qr-tip {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.arrow-icon {
  width: 80rpx;
  height: 80rpx;
}

/* 底部二维码 */
.bottom-section {
  display: flex;
  justify-content: center;
}

.qr-code-box {
  width: 369rpx;
  height: 369rpx;
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #4caf50;
}

.qr-image {
  width: 329rpx;
  height: 329rpx;
}
</style>
