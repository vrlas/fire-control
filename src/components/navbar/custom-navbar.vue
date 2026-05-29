<template>
  <view class="custom-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <!-- 状态栏占位 -->
      <view class="status-bar"></view>
      <!-- 导航栏内容 -->
      <view class="nav-content">
        <!-- 返回按钮 -->
        <view class="back-btn" @click="goBack">
           <image src="/static/arrow-left1@3x.png" mode="aspectFit" class="back-icon"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const title = ref<string>('页面标题')

  const goBack = () : void => {
    // 方式1：普通返回上一页
    uni.navigateBack()

    // 方式2：如果需要更复杂的逻辑，可以使用以下方法
    // const pages = getCurrentPages()
    // if (pages.length > 1) {
    //   uni.navigateBack()
    // } else {
    //   uni.switchTab({
    //     url: '/pages/index/index' // 如果是首页，则跳转到首页
    //   })
    // }
  }
</script>

<style lang="scss" scoped>
  .custom-page {
    height: 2px;
    /* 设置页面背景，例如渐变 */
    background: #fff
  }

  /* 自定义导航栏 */
  .custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    /* 关键：背景透明 */
    background-color: transparent;
  }

  /* 状态栏占位 - 非常重要！ */
  .status-bar {
    width: 100%;
    height: var(--status-bar-height);
  }

  /* 导航栏内容区域 */
  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    /* 导航栏标准高度 */
    padding: 0 15px;
  }

  /* 返回按钮 */
  .back-btn {
    width: 21px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-icon {
    position: fixed;
    left: 10px;
    top: 60px;
    width: 14px;
    height: 17px;
    /* 如果你的图标是白色的，可以在这里设置 */
     // filter: brightness(0) ;
    color: black;
    // background-color: pink;
    z-index:99;
  }

</style>