import { request } from '@/utils/request'

/**
 * 提交上门回收订单
 */
export function submitRecyclingOrder(data: any) {
	return request('POST', '/agent/user/recycling/order/add', data)
}