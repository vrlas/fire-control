import { request } from '@/utils/request'

/**
 * 修改购物车信息
 */
export function modifyInfo(info: any) {
  return request('PUT', '/agent/shop/cart/update', info)
}

/**
 * 购物车列表
 */
export function getList(info: any) {
  return request('POST', '/agent/shop/cart/list', info)
}

/**
 * 添加购物车
 */
export function addInfo(info: any) {
  return request('POST', '/agent/shop/cart/add', info)
}

/**
 * 删除购物车
 */
export function removeInfo(ids: any[]) {
  return request('DELETE', '/agent/shop/cart/delete', ids)
}