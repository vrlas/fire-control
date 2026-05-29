<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
  back: {
    type: Boolean,
    default: () => true
  },
  dark: {
    type: Boolean,
    default: () => true
  }
})

const navBack = () => {
  const pages = getCurrentPages()
  if (pages.length === 1) {
    //如果只有一个页面了，说明无页面可退，直接重定向首页
    uni.switchTab({
      url: '/pages/home/index' // 此处改为实际的首页路径
    })
  } else {
    props.back && uni.navigateBack()
  }
}

onMounted(() => {
  // 根据深色状态自动设置状态栏文字颜色
  uni.setNavigationBarColor({
    frontColor: props.dark ? '#ffffff' : '#000000',
    backgroundColor: props.dark ? '#000000' : '#ffffff'
  })
})
</script>
<template>
  <uni-nav-bar
    fixed
    statusBar
    :dark="dark"
    :left-icon="back ? 'left' : ''"
    :border="false"
    :backgroundColor="dark ? '#1F2C5C' : '#FFFFFF'"
    @clickLeft="navBack"
  >
    <view class="title" :style="{ color: dark ? '#FFFFFF' : '#000000' }">
      <slot>
        {{ title || '标题' }}
      </slot>
    </view>
  </uni-nav-bar>
</template>
<style lang="scss" scoped>
.title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}
</style>
