<template>
  <uni-popup
    ref="popup"
    type="bottom"
    :safe-area="false"
    @change="handlePopupChange"
    @maskClick="close"
  >
    <view class="input-popup-wrapper" :style="{ marginBottom }">
      <slot></slot>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// ========== 此组件为跟随键盘弹起的popup，默认插槽可自定义内容 ========== //
// ========== 使用此组件请给input添加:adjust-position="false" ========== //

const props = defineProps({
  show: {
    type: Boolean,
    default: () => false
  },
  offset: {
    type: Number,
    default: () => 0
  }
})

watch(() => props.show, (show: boolean) => {
  if (show) {
    open()
  } else {
    close()
  }
})

// #ifdef H5
watch(() => props.offset, (offset: number) => {
  marginBottom.value = `${offset}px`
})
// #endif

// 控制弹出层开关
const popup = ref()
const open = () => {
  popup.value?.open('bottom')
}
const close = () => {
  popup.value?.close()
}

// 弹出层状态改变
const emit = defineEmits(['update:show'])
const handlePopupChange = (e: { show: boolean }) => {
  if (e.show !== props.show) {
    emit('update:show', e.show)
  }
}

// 监听键盘高度
const marginBottom = ref('0px')
const onKeyboardHeightChange = (res: { height: number }) => {
  const height = res.height + props.offset
  marginBottom.value = height > 0 ? `${height}px` : '0px'
}

onMounted(() => {
  // #ifndef H5
  uni.onKeyboardHeightChange(onKeyboardHeightChange)
  // #endif
  if (props.show) {
    open()
  }
})

onUnmounted(() => {
  // #ifndef H5
  uni.offKeyboardHeightChange(onKeyboardHeightChange)
  // #endif
})
</script>

<style lang="scss" scoped>
.input-popup-wrapper {
  width: 100%;
  transition: margin-bottom 0.3s ease-out;
}
</style>
