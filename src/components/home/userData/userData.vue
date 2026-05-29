<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getHomeMessage } from '@/api/user'
import { userStore } from '@/stores/app'
import { timeAgo } from '@/utils'

const store = userStore()
const userInfo = computed(() => store.userInfo)
const list = ref([])
const current = ref({})
const interval = ref(0)

function toQrCode() {
  uni.navigateTo({ url: '/pages/my/deliveryCode/deliveryCode' })
}

function toWidthDrawal() {
  uni.navigateTo({ url: '/pages/my/withdrawal/withdrawal' })
}

async function fetchData() {
  list.value = (await getHomeMessage())?.data?.records || []
  getRandom()
}

function getRandom() {
  const random = Math.floor(Math.random() * list.value.length)
  current.value = list.value?.[random] || {}
}

function toPage() {
  uni.switchTab({ url: '/pages/my/index' })
}

function toLogin() {
  if (!userInfo.value.token) uni.navigateTo({ url: '/pages/login/index' })
}

onMounted(() => {
  fetchData()
  interval.value = setInterval(getRandom, 2000)
})
onUnmounted(() => clearInterval(interval.value))
</script>

<template>
  <view class="c-card">
    <view class="relative bg-transparent pt-30rpx">
      <view class="c-personal-center" @click="toWidthDrawal" />
      <view class="box-border flex items-center px-34rpx pt-20rpx" @click="toLogin">
        <image class="mr-20rpx h-110rpx w-110rpx rounded-full" :src="userInfo?.avatarUrl" mode="aspectFill" @click="toPage" />
        <block v-if="userInfo.token">
          <view class="flex-1">
            <view class="flex items-center">
              <text class="text-32rpx text-#333 font-bold">{{ userInfo?.nickname }}</text>
              <view class="ml-16rpx h-44rpx flex flex-nowrap items-center rounded-8rpx text-white font-bold">
                <view class="z-11 h-40rpx w-50rpx -mr-30rpx">
                  <image src="https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/userNameIcon@3x.png"
                    class="h-full w-full" />
                </view>
                <text class="c-user-title">{{ userInfo?.memberLevelConfig?.name }}</text>
              </view>
            </view>
            <text class="c-stats-text">
              参与环保回收<text class="mx-4rpx font-bold">{{ userInfo?.createDays }}</text>天，累计回收<text
                class="mx-4rpx font-bold">
                {{ userInfo?.totalDelivery }}
              </text>kg
            </text>
          </view>
        </block>
        <view v-else class="flex-1 font-700">
          未登录 ❯
        </view>
        <view class="c-qr-wrapper" @click="toQrCode" />
      </view>
    </view>
    <view class="box-border px-40rpx">
      <view class="my-30rpx u-border-b" />
    </view>
    <view class="flex items-center justify-between bg-transparent px-40rpx">
      <view class="flex items-center">
        <image class="h-36rpx w-36rpx"
          src="https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/Player.png" mode="aspectFit" />
        <text class="c-user-text">
          用户{{ current?.userName }}<text class="c-black-text">
            投递{{ current?.deliveryWeight }}kg
            获得{{ current?.value }}元
          </text>
        </text>
      </view>
      <text class="text-24rpx text-#999">{{ timeAgo(current.createTime) }}</text>
    </view>
  </view>
</template>

<style scoped>
.c-card {
  @apply relative mx-18rpx overflow-hidden rounded-20rpx z-10 h-276rpx;
  margin-top: -98rpx;
  background-image: url('https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/userBg2x.png');
  background-size: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.c-personal-center {
  @apply absolute top-0 right-0 flex flex-row items-center justify-center h-78rpx w-262rpx;
  background-image: url('@/static/image/go.png');
  background-size: 100%;
  text-shadow: 0 2px 4px rgba(229, 229, 229, 0.2);
}

.c-user-title {
  @apply h-28rpx leading-28rpx text-right box-border pr-8rpx rounded-10rpx w-88rpx text-14rpx;
  background-image: url('https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/userTitle.png');
  background-size: 100%;
}

.c-stats-text {
  @apply mt-10rpx text-24rpx;
  color: rgba(166, 166, 166, 1);
}

.c-qr-wrapper {
  @apply h-50rpx w-50rpx;
  background-image: url('https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/QRcode.png');
  background-size: 100%;
}

.c-user-text {
  @apply h-36rpx leading-36rpx ml-20rpx text-22rpx;
  color: rgba(29, 33, 41, 1);
}

.c-black-text {
  @apply ml-20rpx h-36rpx leading-36rpx text-22rpx font-400;
  color: rgba(128, 128, 128, 1);
}
</style>