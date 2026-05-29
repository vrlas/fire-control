import type { ApiResponse } from '@/api/types/common'
import { mockDataFactory } from '@/utils/mock'

const baseURL = 'https://api.example.com'

export function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data = {},
  header = {} as any,
  timeout = 30 * 1000
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    const token = uni.getStorageSync('token')
    if (token) header.Authorization = `Bearer ${token}`
    uni.request({
      method,
      url: `${baseURL}${url}`,
      data,
      header,
      timeout,
      success: async (res: any) => {
        const { code, msg } = res.data || {}
        const mockData = mockDataFactory(url, res.data, data)
        if (code === 3001) {
          if (!url.startsWith('/agent/user/detail')) {
            uni.redirectTo({ url: '/pages/login/index' })
          }
        } else if ([500, 502].includes(code)) {
          uni.showToast({ title: msg, icon: 'none' })
        }
        resolve(mockData)
      },
      fail: (err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        resolve({ code: -1, msg: '网络请求失败', data: null })
      }
    })
  })
}

// 文件上传封装
export function uploadFile<T = any>(
  url: string,
  filePath: string,
  formData: FormData,
  name = 'file'
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    uni.uploadFile({
      url: baseURL + url,
      filePath,
      formData,
      name,
      header: {
        Authorization: `Bearer ${token}`
      },
      timeout: 60 * 1000,
      success: (res) => {
        const resData = JSON.parse(res.data)
        if (resData.code === 200) {
          resolve(resData)
        } else {
          uni.showToast({
            icon: 'error',
            title: resData.msg || '请求失败',
            duration: 5000
          })
          reject(resData)
        }
      },
      fail: (res) => {
        reject(res.errMsg)
      }
    })
  })
}
