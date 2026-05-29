/**
 * 邀请记录查询参数
 */
export interface InviteRecordDTO {
  userId?: number
  communityId?: number
  rankingRange?: string
  rankingTimeRange?: string
  startTime?: string
  endTime?: string
  province?: string
  invitedUser?: UserAccountDTO
}

/**
 * 账号信息
 */
export interface UserAccountDTO {
  id?: number
  username?: string
  nickname?: string
  email?: string
  phone?: string
  avatarUrl?: string
}

/**
 * 邀请好友单条记录
 */
export interface InviteRecordVO {
  userId?: number
  nickname?: string
  avatarUrl?: string
  phone?: string
  inviteTitle?: string
  inviteCount?: number
  inviteeName?: string
  inviteeAvatarUrl?: string
  inviteTime?: string
}

/**
 * 邀请好友页面数据
 */
export interface InviteFriendPageVO {
  totalReward?: number
  inviteCount?: number
  friendList?: InviteRecordVO[]
}

/**
 * 邀请排行榜数据
 */
export interface InviteResultVO {
  /** 当前用户信息 */
  currentUser?: InviteRecordVO
  /** 邀请排行列表（不含当前用户重复项） */
  inviteRankList?: InviteRecordVO[]
  /** 当前用户在此榜单中的排名（从1开始） */
  userRank?: number
}

/**
 * 邀请称号配置
 */
export interface InviteTitleConfig {
  id?: number
  agentId?: number
  titleName?: string
  requiredNewUsers?: number
  sortOrder?: number
  isEnabled?: number
  createTime?: string
  updateTime?: string
}