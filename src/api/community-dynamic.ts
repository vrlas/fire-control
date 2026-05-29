import { request } from '@/utils/request'

/**
 * 发布社区动态
 */
export function addInfo(info: any) {
  return request('POST', '/agent/communityDynamic/publish', info)
}

/**
 * 社区动态列表
 */
export function getList(info: any) {
  return request('POST', '/agent/communityDynamic/list', info)
}

/**
 * 社区动态详情
 */
export function getInfo(info: any) {
  return request('POST', '/agent/communityDynamic/detail', info)
}