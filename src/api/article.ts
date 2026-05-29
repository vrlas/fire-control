import { request } from '@/utils/request'

/**
 * 文章详情
 */
export function getInfo(id: string) {
  return request('GET', `/agent/article/view?id=${id}`)
}

/**
 * 文章详情v2
 */
export function getInfoNext(id: string) {
  return request('GET', `/agent/article/news/detail?id=${id}`)
}

/**
 * 文章列表
 */
export function getList(info: any) {
  return request('POST', '/agent/article/list', info)
}

/**
 * 文章列表v2
 */
export function getListNext(info: any) {
  return request('POST', '/agent/article/news/list', info)
}

/**
 * 文章分类
 */
export function getCateList(info: any) {
  return request('POST', '/agent/article/category/list', info)
}