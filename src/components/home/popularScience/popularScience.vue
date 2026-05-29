<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getBannerByCode } from '@/api/user'

const list = ref<any>({})

async function fetchData() {
	list.value = (await getBannerByCode(1))?.data || {}
}

onMounted(fetchData)
</script>

<template>
	<view class="main">
		<view class="content">
			<view class="titleText">
				可回收物科普
			</view>

			<swiper class="mt-10rpx h-full w-full" autoplay circular indicator-dots indicator-color="#fff6"
				indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in list || []" :key="index">
					<image class="h-full w-full" :src="item" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.main {
	box-sizing: border-box;
	margin: 24rpx 0;
	padding: 0 18rpx;
}

.content {
	box-sizing: border-box;
	height: 208px;
	width: 100%;
	opacity: 1;
	border-radius: 6px;
	background-color: rgba(255, 255, 255, 1);
	display: flex;
	flex-direction: column;
	align-items: left;
	padding: 16px 17px 14px 17px;

	.titleText {
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 21.22px;
		color: rgba(0, 0, 0, 1);
		text-align: left;
		vertical-align: top;
	}

	.poplular-image {
		height: 148px;
		width: 100%;
		border-radius: 6px;
		margin-top: 8px;
		overflow: hidden;

		::v-deep .uni-swiper-dot {
			/* 将默认的圆形 (8x8px) 改为短条形 */
			width: 12px;
			height: 4px;
			border-radius: 2px;
			background-color: rgba(255, 255, 255, 0.5);
		}

		::v-deep .uni-swiper-dot-active {
			width: 20px;
			height: 4px;
			border-radius: 2px;

			background-color: #FFFFFF;
		}
	}

	.swiper-image {
		width: 100%;
		height: 100%;
	}
}
</style>