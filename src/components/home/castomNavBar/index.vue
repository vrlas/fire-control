<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getBannerByCode } from '@/api/user'

const list = ref<any>([])

async function fetchData() {
	list.value = (await getBannerByCode(0))?.data || {}
}

onMounted(fetchData)
</script>

<template>
	<view class="sticky left-0 top-0 top-0 h-484rpx">
		<swiper class="h-full w-full" autoplay circular indicator-color="#fff6" indicator-active-color="#fff">
			<swiper-item v-for="(item, index) in list || []" :key="index">
				<image class="h-full w-full" :src="item" mode="aspectFill" />
			</swiper-item>
		</swiper>
	</view>
</template>