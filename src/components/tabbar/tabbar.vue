<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getCode, getUserInfo, handleCooperate, scanDevice } from '@/api/user'
import { userStore } from '@/stores/app'
import { subscribe } from '@/utils'

const activePath = ref('/pages/home/index')
const store = userStore()

function getActivePath() {
  const pages = getCurrentPages()
  if (pages.length) activePath.value = `/${pages.at(-1)?.route}`
}

function switchTab(path: string) {
  if (path === '/pages/my/index') {
    getUserInfo().then((res: any) => {
      store.modifyUserInfo({
        ...store.userInfo,
        ...res?.data
      })
    })
  }
  uni.switchTab({ url: path })
  if (path === '/pages/cooperation/cooperation') handleCooperate()
}

function navToCode() {
  if (!uni.getStorageSync('token')) return uni.navigateTo({ url: '/pages/login/index' })
  uni.scanCode({
    success: async (res: any) => {
      const code = res.path.split('=').at(-1)
      const { data } = (await getCode(code))?.data
      scanDevice(data)
    }
  })
}

onMounted(getActivePath)
onShow(getActivePath)
</script>

<template>
  <view class="c-tabbar">
    <view class="c-tab" @click="switchTab('/pages/home/index')">
      <image v-if="activePath === '/pages/home/index'" src="@/static/image/tabbar/activeIndex.png"
        class="h-42rpx w-42rpx" mode="aspectFit" />
      <image v-else src="@/static/image/tabbar/index.png" class="h-42rpx w-42rpx" mode="aspectFit" />
      <view class="c-tabbar-label mt-4rpx h-32rpx text-20rpx font-normal leading-32rpx"
        :class="{ active: activePath === '/pages/home/index' }">
        首页
      </view>
    </view>
    <view class="c-tab" @click="switchTab('/pages/shoppingMall/shoppingMall')">
      <image v-if="activePath === '/pages/shoppingMall/shoppingMall'" src="@/static/image/tabbar/activeMail.png"
        class="h-42rpx w-42rpx" mode="aspectFit" />
      <image v-else src="@/static/image/tabbar/mail.png" class="h-42rpx w-42rpx" mode="aspectFit" />
      <view class="c-tabbar-label mt-4rpx h-32rpx text-20rpx font-normal leading-32rpx"
        :class="{ active: activePath === '/pages/shoppingMall/shoppingMall' }">
        商城
      </view>
    </view>
    <view class="relative mt-36rpx h-92rpx w-130rpx">
      <view class="c-circle-button" @click="subscribe('delivery', navToCode)">
        <image src="@/static/image/tabbar/Scan.png" class="h-68rpx w-68rpx" mode="aspectFit" />
      </view>
      <view class="c-mid-text">
        扫一扫
      </view>
    </view>
    <view class="c-tab" @click="switchTab('/pages/cooperation/cooperation')">
      <image v-if="activePath === '/pages/cooperation/cooperation'" src="@/static/image/tabbar/activeCollaboration.png"
        class="h-42rpx w-42rpx" mode="aspectFit" />
      <image v-else src="@/static/image/tabbar/collaboration.png" class="h-42rpx w-42rpx" mode="aspectFit" />
      <view class="c-tabbar-label mt-4rpx h-32rpx text-20rpx font-normal leading-32rpx"
        :class="{ active: activePath === '/pages/cooperation/cooperation' }">
        合作
      </view>
    </view>
    <view class="c-tab" @click="switchTab('/pages/my/index')">
      <image v-if="activePath === '/pages/my/index'" src="@/static/image/tabbar/activeMy.png" class="h-42rpx w-42rpx"
        mode="aspectFit" />
      <image v-else src="@/static/image/tabbar/my.png" class="h-42rpx w-42rpx" mode="aspectFit" />
      <view class="c-tabbar-label mt-4rpx h-32rpx text-20rpx font-normal leading-32rpx"
        :class="{ active: activePath === '/pages/my/index' }">
        我的
      </view>
    </view>
  </view>
</template>

<style scoped>
.c-tabbar {
  @apply fixed left-0 -bottom-20rpx z-99 box-border w-full h-202rpx flex flex-row items-center justify-around;
  background-image: url('@/static/image/tabbar/tabbarBG.png');
  background-repeat: no-repeat;
  background-size: 100%;
}

.c-tabbar-label {
  color: rgba(166, 166, 166);
}

.c-tab {
  @apply mt-36rpx h-92rpx w-130rpx flex flex-col items-center text-center;
}

.c-tabbar-label.active {
  color: rgba(67, 207, 124);
}

.c-circle-button {
  @apply absolute left-1/2 -translate-x-1/2 -top-60rpx w-104rpx h-104rpx rounded-full flex items-center justify-center;
  background: rgba(67, 207, 124);
}

.c-mid-text {
  @apply absolute bottom-16rpx left-0 right-0 h-32rpx leading-32rpx text-20rpx font-normal text-center;
  color: rgba(166, 166, 166);
}
</style>
