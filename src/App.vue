<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { getCode, scanDevice } from '@/api/user'

onShow(async () => {
  const inviteId = uni.getEnterOptionsSync()?.query?.scene
  if (inviteId) {
    // 避免报错导致后续无法运行
    try {
      if (isNaN(+inviteId)) {
        uni.setStorageSync('inviteId', inviteId)
      } else {
        const code = inviteId.split('=').at(-1)
        uni.setStorageSync('binNumber', code)
        if (!uni.getStorageSync('token')) return
        getCode(code).then(({ data }: any) => scanDevice(data?.data))
      }
    } catch (error) {
      console.log(error)
    }
  }
})
</script>

<style lang="scss">
/* 隐藏全局滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
  background: transparent;
}

/* 兼容性处理 */
page {
  -webkit-overflow-scrolling: touch;
}

.u-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-weight: 500;
  width: 112rpx;
  height: 44rpx;
}

.u-tag.orange {
  background-color: #FC7C2944;
  color: #FC7C29;
}

.u-tag.green {
  background-color: #4DD18344;
  color: #4DD183;
}

.u-tag.gray {
  background-color: #57575744;
  color: #808080;
}
</style>