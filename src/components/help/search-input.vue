<script setup lang="ts">
interface Props {
  placeholder?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '关键词检索',
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

function onInput(e: any) {
  const value = e.detail?.value || ''
  emit('update:modelValue', value)
}

function onConfirm() {
  emit('search', props.modelValue)
}

function onFocus() {
  emit('focus')
}

function onBlur() {
  emit('blur')
}
</script>

<template>
  <view class="search-input">
    <view class="search-box">
      <image
        class="search-icon"
        src="/static/aboutRecycle/fangdajing-1@3x.png"
        mode="aspectFit"
      />
      <input
        class="input"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        @confirm="onConfirm"
        @focus="onFocus"
        @blur="onBlur"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-input {
  padding: 20rpx 30rpx;
}

.search-box {
  display: flex;
  align-items: center;
  height: 72rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 0 24rpx;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}

.input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
}

.input::placeholder {
  color: #999;
}
</style>
