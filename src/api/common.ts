import { request } from '@/utils/request'

/**
 * 基础用户信息-头像
 */
export function uploadAvatar(filePath: string) {
  return request('POST', `/auth/simple-avatar?file=${filePath}`)
}