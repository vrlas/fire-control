import { request } from '@/utils/request'

/**
 * 抵扣比例列表
 */
export function getDiscountList(info: any) {
  return request('POST', '/agent/user/goods/order/exchangeRules', info)
}