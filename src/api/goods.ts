import { request } from '@/utils/request'

/**
 * 商品分类列表
 */
export function getGoodsCate(info: any) {
  return request('GET', '/admin/goods/category/all', info)
}