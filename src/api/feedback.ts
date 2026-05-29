import { request } from '@/utils/request'

// 排序字段
export interface SimpleSortRequest {
  key?: string
  order?: 'asc' | 'desc'
}

// 查询参数 DTO
export interface FeedbackRecordDTO {
  id?: number
  feedbackType?: number
  typeId?: number
  userId?: number
  feedbackContent?: string
  content?: string
  feedbackUrl?: string
  imageUrl?: string
  replyContent?: string
  source?: number
}

// 分页查询参数
export interface PageRequestFeedbackRecordDTO {
  page: number
  size: number
  sort: SimpleSortRequest[]
  keyword?: FeedbackRecordDTO
}

export interface FeedbackRecordVO {
  id: number
  typeId: number
  userId: number
  userType?: number
  parentId?: number
  content: string
  imageUrl?: string
  createTime: string
  agentId?: number
  status: number
  childList?: FeedbackRecordVO[]
  userName?: string
  phone?: string
  avatarUrl?: string
}

// 分页结果
export interface IPageFeedbackRecordVO {
  size: number
  total: number
  records: FeedbackRecordVO[]
  current: number
  pages: number
}

/**
 * 获取反馈列表
 */
export function getFeedbackList(info: any) {
  return request('POST', '/agent/feedback/list', info)
}

/**
 * 添加反馈
 */
export function addFeedback(data: FeedbackRecordDTO) {
  return request<number>('POST', '/agent/feedback/add', data)
}

/**
 * 获取反馈详情
 */
export function getFeedbackDetail(id: number) {
  return request('GET', `/agent/feedback/view?id=${id}`)
}

/**
 * 获取反馈类型列表
 */
export function getFeedbackTypeList(info: any) {
  return request('GET', `/agent/proxy/feedback-type/list?page=${info.page}&pageSize=${info.pageSize}&status=${info.status}`)
}

// 上传文件响应
export interface UpLoadFileVo {
  url: string
}

export interface RUpLoadFileVo {
  success: boolean
  code: number
  msg: string
  data: UpLoadFileVo
}

/**
 * 上传图片
 */
export function uploadFeedbackImage(filePath: string, url: string): Promise<RUpLoadFileVo> {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    uni.uploadFile({
      url: `https://huishou.honelem.cn/api${url}`,
      filePath,
      name: 'file',
      header: {
        Authorization: `Bearer ${token}`
      },
      timeout: 60 * 1000,
      success: (res) => {
        try {
          const resData = JSON.parse(res.data)
          if (resData.success) {
            resolve(resData)
          } else {
            uni.showToast({
              icon: 'error',
              title: resData.msg || '上传失败',
              duration: 3000
            })
            reject(resData)
          }
          // eslint-disable-next-line unused-imports/no-unused-vars
        } catch (e: any) {
          reject(new Error('解析响应失败'))
        }
      },
      fail: (res) => {
        uni.showToast({
          icon: 'none',
          title: `上传失败：${res.errMsg}`,
          duration: 3000
        })
        reject(new Error(res.errMsg))
      }
    })
  })
}
