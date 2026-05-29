import { request } from '@/utils/request'

// 用户签到
export function userCheckIn() {
	return request<string>('POST', '/agent/user/checkin/checkin')
}

// 2用户签到信息接口
export interface UserPointsInfo {
	id: number
	points: number // 当前积分
	signDays: number // 总签到天数 (或连续签到天数，视业务定义)
	cachedStreak: number // 缓存的连续天数
	checkinDate: string // 最近签到时间
	streakCacheDate: string // 连续签到缓存时间
}
// 2获取签到天数和当前积分
export function getUserPointsInfo() {
	return request<UserPointsInfo>('GET', '/agent/user/checkin/getStreakDays')
}

// 3签到规则项接口
export interface CheckInRule {
	id: number
	streakDays: number // 连续签到天数
	points: number // 对应获得的积分
}
// 3获取签到规则列表
export function getCheckInRules() {
	// 返回的是规则数组，所以在泛型中传入 CheckInRule[]
	return request<CheckInRule[]>('GET', '/agent/user/checkin/getCheckinRules')
}