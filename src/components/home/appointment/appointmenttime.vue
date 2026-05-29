<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const popupRef = ref<any>(null)
const selectedDisplayTime = ref('')
const pickerValue = ref([0, 0])
const dates = ref<{ text: string, date: string }[]>([])
const times = ref<string[]>([])

const now = new Date()
const currentHour = now.getHours()
const todayAvailable = currentHour < 20

const allTimes = Array.from({ length: 7 }, (_, i) => {
	const h = 6 + i * 2
	return `${String(h).padStart(2, '0')}:00-${String(h + 2).padStart(2, '0')}:00`
})

function generateDates(daysCount = 7) {
	const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	const startDay = todayAvailable ? 0 : 1
	return Array.from({ length: daysCount }, (_, idx) => {
		const i = idx + startDay
		const date = new Date(now)
		date.setDate(now.getDate() + i)
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const formattedDate = `${month}-${day}`
		const prefix = i === 0 ? '今天' : i === 1 ? '明天' : i === 2 ? '后天' : weekNames[date.getDay()]
		return { text: `${prefix}${formattedDate}`, date: formattedDate }
	})
}

function updateTimes(dateIndex: number) {
	const isToday = todayAvailable && dateIndex === 0
	times.value = isToday ? allTimes.filter((_, i) => 6 + i * 2 + 2 > currentHour) : allTimes
}

function openTimePicker() {
	popupRef.value?.open()
}

function onPickerChange(e: any) {
	const [dateIdx, timeIdx] = e.detail.value
	if (dateIdx !== pickerValue.value[0]) {
		updateTimes(dateIdx)
		pickerValue.value = [dateIdx, 0]
	} else {
		pickerValue.value = [dateIdx, timeIdx]
	}
}

function onCancel() {
	popupRef.value?.close()
}

function onConfirm() {
	const selectedDate = dates.value[pickerValue.value[0]]?.text || ''
	const selectedTime = times.value[pickerValue.value[1]] || ''
	selectedDisplayTime.value = `${selectedDate} ${selectedTime}`
	popupRef.value?.close()
}

function getTime() {
	console.log(selectedDisplayTime.value)
	return selectedDisplayTime.value.slice(2)
}

function clearTime() {
	selectedDisplayTime.value = ''
}

onMounted(() => {
	dates.value = generateDates()
	updateTimes(0)
})
defineExpose({ getTime, clearTime })
</script>

<template>
	<view class="mt-24rpx rd-12rpx bg-#fff">
		<view class="h-144rpx flex items-center justify-between rd-12rpx pl-34rpx pr-44rpx" @click="openTimePicker">
			<text class="text-32rpx color-#000 font-500 leading-42rpx">预约时间</text>
			<text class="c-time-icon" :class="{ 'c-time-selected': selectedDisplayTime }">
				{{ selectedDisplayTime }}
			</text>
		</view>
	</view>

	<uni-popup ref="popupRef" type="top" background-color="#FFFFFF">
		<view class="fixed z-2 h-screen w-screen flex flex-col -translate-x-18rpx">
			<view class="flex-1 bg-#8888" @click="onCancel" />
			<view class="h-600rpx">
				<view class="w-100vw bg-#fff">
					<view class="flex justify-between border-b-2rpx border-b-#f5f5f5 border-b-solid px-30rpx py-24rpx">
						<text class="text-32rpx color-#888 font-500" @click="onCancel">取消</text>
						<text class="text-32rpx color-#34C759 font-500" @click="onConfirm">确认</text>
					</view>
					<picker-view class="h-500rpx w-full" :value="pickerValue" indicator-style="height: 50px;"
						@change="onPickerChange">
						<picker-view-column>
							<view v-for="(item, index) in dates" :key="index" class="flex items-center justify-center text-32rpx">
								{{ item.text }}
							</view>
						</picker-view-column>
						<picker-view-column>
							<view v-for="(item, index) in times" :key="index" class="flex items-center justify-center text-32rpx">
								{{ item }}
							</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<style scoped lang="scss">
.c-time-icon {
	background: url("https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/timeselection.png") no-repeat right center / contain;
	display: inline-block;
	vertical-align: middle;
	min-height: 44rpx;
	min-width: 200rpx;
	font-size: 32rpx;
	color: transparent;
}

.c-time-selected {
	background-image: none;
	color: #333;
	min-width: auto;
	min-height: auto;
	text-align: right;
}
</style>
