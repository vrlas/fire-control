<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const list = [
	'/pages/recycle/convenienceServices/convenienceServices',
	'/pages/delivery/rank',
	'/pages/help/index?type=5',
	'/pages/community/communityNews/communityNews',
	'/pages/recycle/recycleIndex'
]

function handleCorner(e: any) {
	const query = uni.createSelectorQuery().in(instance)
	query.select('#corner')
		.boundingClientRect(({ left, top, width, height }: any) => {
			const x = e.detail.x - left
			const y = e.detail.y - top
			const w = width
			const h = height
			const cx = w / 2
			const cy = h / 2
			if (x <= cx && y <= cy) {
				toPage(0)
			} else if (x > cx && y <= cy) {
				toPage(1)
			} else if (x <= cx && y > cy) {
				toPage(2)
			} else {
				toPage(3)
			}
		})
		.exec()
}

function toPage(n: number) {
	uni.navigateTo({ url: list[n] })
}
</script>

<template>
	<view class="relative mx-auto box-border w-714rpx u-center rounded-32rpx bg-white p-16rpx">
		<image id="corner" class="w-full"
			src="https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/分组2@3x.png" mode="widthFix"
			@click="handleCorner" />
		<view
			class="c-path absolute bottom-0 left-50% right-0 top-50% z-1 box-border h-240rpx w-402rpx u-center overflow-hidden p-20rpx -translate-x-50% -translate-y-50%">
			<image class="h-full" src="https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/上门回收@3x.png"
				mode="aspectFill" @click="toPage(4)" />
		</view>
	</view>
</template>

<style scoped lang="scss">
.c-path {
	clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
</style>