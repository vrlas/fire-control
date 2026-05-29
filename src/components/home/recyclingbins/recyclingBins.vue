<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getNearbyRecyclingBins } from '@/api/user'
import BinProgress from '@/components/bin-progress/index.vue'
import { formatNumber, getAddress, getDeliveryStatusText } from '@/utils'
import { BASIC_QUERY_INFO } from '@/utils/constrant'

const queryInfo = ref<any>({ ...BASIC_QUERY_INFO(), size: 2 })
const list = ref<any[]>([])

function onMoreRecyclingBinsClick() {
  uni.navigateTo({
    url: '/pages/recycle/moreRecyclingBins/moreRecyclingBins'
  })
}

function toDetail(id: string) {
  uni.navigateTo({
    url: `/pages/recycle/recyclingBinsDetails/recyclingBinsDetails?id=${id}`
  })
}

function loadData() {
  getAddress(async ({ latitude, longitude }: any) => {
    queryInfo.value.keyword.userLatitude = latitude
    queryInfo.value.keyword.userLongitude = longitude
    list.value = (await getNearbyRecyclingBins(queryInfo.value))?.data?.records || []
  })
}

onMounted(loadData)
defineExpose({
  loadData
})
</script>

<template>
  <view class="c-bings">
    <view class="c-bings-header">
      <view class="flex items-center font-700">
        <view class="mr-8px h-18px w-4px rounded-6px bg-#66faa1" />
        <text class="text-16px font-700">附近回收箱</text>
      </view>
      <view class="flex items-center">
        <view class="ml-4px h-22px w-83px text-13px font-400">
          <image class="h-full w-full" src="/static/image/delivery.png" />
        </view>
      </view>
    </view>
    <view class="relative mt-20rpx h-460rpx w-full flex flex-col gap-y-20rpx">
      <view v-for="(item, index) in list" :key="index"
        class="relative box-border h-192rpx w-full flex items-start rounded-20rpx bg-white pb-16rpx pl-16rpx pr-24rpx pt-16rpx"
        @click="toDetail(item.id)">
        <view class="relative h-130rpx min-w-100rpx flex flex-col rounded-12rpx">
          <BinProgress v-if="item.isStandby" size="large" :progress="item.usageRate" :is-stand-by="1"
            :inner-text="getDeliveryStatusText(item.status, item.usageRate)" />
          <BinProgress v-else size="large" :progress="item.recyclingBinBoxVOList?.[0]?.usageRate" :is-stand-by="0"
            :outer-text="item.recyclingBinBoxVOList?.[0]?.categoryNames" />
        </view>

        <view class="flex flex-1 flex-col justify-start pl-40rpx">
          <view class="absolute left-160rpx top-20rpx h-48rpx max-w-400rpx text-24rpx text-black font-700">
            {{ item.binName }}
          </view>
          <view v-if="item.isStandby" class="mt-60rpx flex flex-row gap-x-40rpx">
            <BinProgress v-for="m, i in item.recyclingBinBoxVOList" :key="i" :is-stand-by="1"
              :outer-text="m.categoryNames" size="small" :progress="m?.usageRate" />
          </view>
          <view v-else class="mt-60rpx flex flex-row gap-x-40rpx">
            <BinProgress v-for="m, i in (item.recyclingBinBoxVOList || []).slice(1)" :key="i" :is-stand-by="0"
              :outer-text="m.categoryNames" size="small" :progress="m?.usageRate" />
          </view>
        </view>
        <view class="ml-auto flex items-center text-24rpx text-#A6A6A6 leading-34rpx">
          {{ formatNumber((item.distance / 1000)) }}km{{ `\u003E` }}
        </view>
      </view>
      <image v-show="list.length > 1" src="/static/image/logo.png"
        class="pointer-events-none absolute right-0 top-20rpx z-1 h-348rpx w-348rpx" />
    </view>

    <view class="h-20px text-center text-12px text-white font-400 leading-15px" @click="onMoreRecyclingBinsClick">
      更多回收箱 {{ `\u003E` }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.c-bings {
  @apply mt-12px mb-12px mx-9px h-540rpx rounded-20rpx bg-#4DD183 pt-10px pr-10px pl-8px box-border flex flex-col items-center;
}

.c-bings-header {
  @apply flex justify-between items-center w-full box-border h-25px px-8px;
}

.c-bings-content {
  @apply w-full h-83px rounded-10px bg-white flex p-10rpx box-border;
}
</style>
