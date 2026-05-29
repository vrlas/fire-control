<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')
// 暴露获取备注内容的方法
function getContent() {
	return inputValue.value
}
// 暴露清除备注内容的方法
function clearNotes() {
	inputValue.value = ''
}
defineExpose({
	getContent,
	clearNotes
})
</script>

<template>
	<view class="main">
		<view class="content">
			<view class="titleText">
				备注
			</view>
			<view class="input-text">
				<textarea v-model="inputValue" :show-confirm-bar="false" type="input-text-value" class="input-text-value"
					placeholder-style="font-size: 26rpx;font-weight: 400" placeholder="选填，请输入您的其他要求" />
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.main {
	box-sizing: border-box;
	margin: 24rpx 0;
	padding: 18rpx;

	.content {
		box-sizing: border-box;
		opacity: 1;
		border-radius: 12px;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: left;
		padding: 28rpx;

		.titleText {
			font-size: 32rpx;
			font-weight: 500;
			color: #000;
			text-align: left;
		}

		.input-text {
			box-sizing: border-box;
			opacity: 1;
			font-size: 26rpx;
			font-weight: 500;
			color: #000;
			border: 1px solid rgba(204, 204, 204, 1);
			margin-top: 8px;
			padding: 7px;
			border-radius: 12rpx;

			.input-text-value {
				height: 300rpx;
			}
		}
	}
}
</style>