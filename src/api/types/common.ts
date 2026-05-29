// 列表数据类型
export interface ListInterface<T> {
  records: T
  total: number
}

// 接口响应根数据类型
export interface ApiResponse<T> {
  code: number
  data?: T
  msg: string
  success: boolean
}

// 列表数据类型
export interface ListInterface<T> {
  records: T
  total: number
}

// 列表请求类型
export interface ListRequestInterface<T> {
  page: number
  size: number
  sort?: {
    key: string
    order: string
  }[]
  keyword: T
}
