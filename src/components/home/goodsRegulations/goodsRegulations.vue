<script setup lang="ts">
defineProps<{ items: any[] }>()
</script>

<template>
	<view class="my-24rpx box-border flex flex-col gap-16rpx px-18rpx">
		<view v-for="item in items" :key="item.id"
			class="h-126rpx flex items-center justify-between rounded-12rpx bg-white pl-34rpx pr-42rpx">
			<view class="min-w-120rpx flex flex-col items-start text-28rpx text-#333 font-500">
				{{ item.categoryName }}
			</view>
			<view class="min-w-140rpx flex justify-start px-16rpx">
				<text class="text-24rpx text-#A6A6A6 font-500">(最低-{{ item.lowNumber }}{{ item.categoryUnit }})</text>
			</view>
			<view class="flex gap-x-1">
				<input :value="item.num" type="digit" placeholder="请输入" class="text-right"
					@input="(e: any) => item.num = e.target.value">
				<text class="text-32rpx text-#333 font-500">{{ item.categoryUnit }}</text>
			</view>
		</view>
	</view>
</template>
