import { request } from '@/utils/request'

/**
 * 申请合作
 */
export function addInfo(info: any) {
  return request('POST', '/agent/agency/apply/add', info)
}