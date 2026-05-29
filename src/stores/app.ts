import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
import { NO_LOGIN_DATA } from '@/utils/constrant'

export const useAppStore = defineStore('app', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
})

/**
 * 用户信息
 */
export const userStore = defineStore('userInfo', () => {
  const token = ref(uni.getStorageSync('token'))
  const defaultInfo = {
    ...NO_LOGIN_DATA
  }
  const userInfo = ref(uni.getStorageSync('loginInfo') || defaultInfo)
  if (token.value) {
    getUserInfo().then((res: any) => {
      userInfo.value = { ...userInfo.value, ...res.data }
    })
  }
  function modifyUserInfo(val: any) {
    userInfo.value = { ...defaultInfo, ...val }
    uni.setStorageSync('loginInfo', userInfo.value)
  }
  function modifyToken(val: string) {
    token.value = val
    uni.setStorageSync('token', val)
  }
  function clear() {
    userInfo.value = { ...defaultInfo }
    uni.clearStorageSync()
  }
  return { token, userInfo, modifyToken, modifyUserInfo, clear }
})