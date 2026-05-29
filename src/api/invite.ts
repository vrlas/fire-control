import type { InviteFriendPageVO, InviteRecordDTO, InviteResultVO, InviteTitleConfig } from './types/inviteType'
import { request } from '@/utils/request'

/**
 * 获取邀请好友记录列表
 * @param data 查询参数
 */
export function getInviteRecord(data: InviteRecordDTO) {
  return request<InviteFriendPageVO>('POST', '/admin/communityShare/inviteRecord', data)
}

/**
 * 获取邀请排行榜
 * @param data 查询参数
 */
export function getInviteRanking(data: InviteRecordDTO) {
  return request<InviteResultVO>('POST', '/admin/communityShare/inviteRanking', data)
}

/**
 * 获取邀请称号列表
 */
export function getInviteTitleList() {
  return request<InviteTitleConfig[]>('GET', '/admin/rule-setting/invite-title/list')
}

/**
 * 获取邀请汇总
 */
export function getInviteSummary() {
  return request('GET', '/agent/user/invite/rewardSummary')
}

/**
 * 获取邀请详情
 */
export function getInviteDetail(id: number) {
  return request('GET', `/agent/user/invite/inviteeRewards?inviteeUserId=${id}`)
}

/**
 * 邀请奖励列表
 */
export function getInviteList(info: any) {
  return request('POST', '/agent/user/point/inviteRewardList', info)
}