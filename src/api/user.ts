import { BANNER_CODE, DEFAULT_AVATAR } from '@/utils/constrant'
import { request } from '@/utils/request'

// 通用响应类型接口
export interface ApiResponse<T> {
  success: boolean
  code: number
  msg: string
  data: T
}

export interface WithdrawRecordItem {
  id: string // 申请ID
  withdrawNo: string // 提现单号
  amount: number // 提现金额
  status: number // 状态: 0-待审批, 1-已通过, 2-已驳回
  statusText: string // 状态文本
  applyTime: string // 申请时间
  auditTime: string // 审核时间
  rejectReason: string // 驳回原因
}
export interface WithdrawRecordResult {
  list: WithdrawRecordItem[]
  total: number
  page: number
  pageSize: number
}

// 账号密码登录
export interface LoginPasswordForm {
  username: string
  password: string
}
export interface LoginResponse {
  phone: string
  token: string
  userId: number
  username: string
  nickname?: string
  email?: string
}

export interface User {
  id: number // 对应 integer(int64)，JS/TS 中统一用 number
  username: string // 用户名
  nickname: string // 昵称
  email: string // 电子邮箱
  phone: string // 电话（通常用 string 避免科学计数法）
  avatarUrl: string // 头像 URL
  camelCoin: number // 骆驼币（数值类型）
  titleName: string // 头衔名称
}

export interface UserInfoInterface {
  id?: number
  username?: string
  phone?: string
  nickname?: string
  avatar?: string
  email?: string
}

// 微信验证手机号登录
export function wxMiniProgramPhone(code: string, jsCode: string) {
  const inviteId = uni.getStorageSync('inviteId')
  const binNumber = uni.getStorageSync('binNumber')
  const suffix = inviteId ? `&inviteId=${inviteId}` : ''
  const codeSuffix = binNumber ? `&binNumber=${binNumber}` : ''
  return request<LoginResponse>('GET', `/agent/user/wx-mini-program-phone?code=${code}&jsCode=${jsCode}${suffix}${codeSuffix}`)
}

// 微信jsCode登录
export function wxMiniProgram(jsCode: string) {
  return request<LoginResponse>('GET', `/agent/user/wxLogin/${jsCode}`)
}
// 模拟登录
export function accountLogin(data: LoginPasswordForm) {
  return request<LoginResponse>('POST', '/auth/login', data)
}

// 通过电话号码查询用户更多信息
export function getLoginUserInfo(phone: string) {
  const encodedPhone = encodeURIComponent(phone)
  return request<User>('GET', `/agent/user/userInfoPhone?phone=${encodedPhone}`)
}

export function getLoginUserAddress(data: any) {
  return request('POST', '/agent/user/address/list', data)
}

export function addUserAddress(data: any) {
  return request<ApiResponse<number>>('POST', '/agent/user/address/add', data)
}

export function updateUserAddress(data: any) {
  return request<ApiResponse<number>>('PUT', '/agent/user/address/update', data)
}

// 删除地址
export function deleteUserAddress(id: number) {
  return request<ApiResponse<number>>('PUT', `/agent/user/address/delete?id=${id}`)
}

// 获取短信验证码
export function getAuthCode(phone: string) {
  return request('POST', '/agent/common/account/getAuthCode', { phone })
}

// 获取短信验证码
export function loginByMessage(data: any) {
  return request('POST', '/agent/common/account/loginByMessage', data)
}

/**
 * 上门回收订单列表
 */
export function getRecyclingOrderList(queryInfo: any) {
  return request('POST', '/agent/user/recycling/order/list', queryInfo)
}

/**
 * 上门回收订单详情
 */
export function getRecyclingOrderInfo(id: string) {
  return request('GET', `/agent/user/recycling/order/view?id=${id}`)
}

/**
 * 附近回收箱
 */
export function getNearbyRecyclingBins(queryInfo: any) {
  return request('POST', '/agent/user/recycling/bin/list', queryInfo)
}

/**
 * 扫描柜机
 */
export function scanDevice(id: string) {
  return request('GET', `/agent/user/scanDevice?deviceId=${id}`)
}

/**
 * 投递订单列表
 */
export function getDeliveryOrderList(queryInfo: any) {
  return request('POST', '/agent/user/delivery/order/listForUser', queryInfo)
}

/**
 * 投递订单详情
 */
export function getDeliveryInfo(id: string) {
  return request('GET', `/agent/user/delivery/order/view?id=${id}`)
}

/**
 * 商城订单列表
 */
export function getMallOrderList(queryInfo: any) {
  return request('POST', '/agent/user/goods/order/list', queryInfo)
}

/**
 * 商城列表
 */
export function getMallList(queryInfo: any) {
  return request('POST', '/agent/user/goods/list', queryInfo)
}

/**
 * 商品详情
 */
export function getMallDetail(id: string) {
  return request('GET', `/agent/user/goods/view?id=${id}`)
}

/**
 * 收藏商品
 */
export function collectGoods(id: string) {
  return request('POST', `/agent/user/goods/collect?goodsId=${id}`)
}

/**
 * 取消收藏商品
 */
export function cancelCollect(id: string) {
  return request('POST', `/agent/user/goods/uncollect?goodsId=${id}`)
}

/**
 * 查询地址详情
 */
export function getAddrById(id: string) {
  return request('GET', `/agent/user/address/view?id=${id}`)
}

/**
 * 预下单
 */
export function preOrder(info: any) {
  return request('POST', '/agent/user/goods/order/preOrder', info)
}

/**
 * 订单列表
 */
export function getOrderList(queryInfo: any) {
  return request('POST', '/agent/user/goods/order/list', queryInfo)
}

/**
 * 取消订单
 */
export function cancelOrder(id: string) {
  return request('PUT', `/agent/user/goods/order/cancel?id=${id}`)
}

/**
 * 商城订单详情
 */
export function getMallOrderDetail(id: string) {
  return request('GET', `/agent/user/goods/order/view?id=${id}`)
}

export function applyWithdraw(data: { amount: number }) {
  return request('POST', '/agent/user/withdraw/apply', data)
}

/**
 * 提现记录汇总
 */
export function getWithdrawSummary() {
  return request('GET', '/agent/user/withdraw/summary')
}

/**
 * 提现记录
 */
export function getWithdrawRecords(info: any) {
  const suffix = info.status ? `&status=${info.status}` : ''
  return request('GET', `/agent/user/withdraw/records?page=${info.page}&pageSize=${info.pageSize}${suffix}`)
}

/**
 * 骆驼币/积分明细
 */
export function getCoinList(info: any) {
  return request('POST', `/agent/user/coin/list`, info)
}

/**
 * 回收箱详情
 */
export function getRecyclingBinDetail(info: any) {
  return request('POST', `/agent/user/recycling/bin/view`, info)
}

/**
 * 活动列表
 */
export function getActivityList(info: any) {
  return request('POST', '/agent/user/event/list', info)
}

/**
 * 新闻中心
 */
export function getNewsList(info: any) {
  return request('POST', '/admin/content/news/list', info)
}

/**
 * 确定收货
 */
export function sureOrder(id: string) {
  return request('POST', `/agent/user/goods/order/confirm?id=${id}`)
}

/**
 * 积分列表
 */
export function getScoreList(info: any) {
  return request('POST', '/agent/user/point/list', info)
}

/**
 * 取消上门订单
 */
export function cancelRecyclingOrder(info: any) {
  return request('POST', `/agent/user/recycling/order/cancel?id=${info.id}&remark=${info.remark}`)
}

/**
 * 获取邀请二维码
 */
export function getInviteQRCode() {
  return request('GET', '/agent/user/invite/myCode')
}

/**
 * 获取用户环保数据统计
 */
export function getEcoData() {
  return request('GET', '/agent/user/eco-stats')
}

/**
 * 获取所有成长任务
 */
export function getAllGrowthTasks() {
  return request('GET', '/agent/user/growth-task/all')
}

/**
 * 获取邀请明细列表
 */
export function getInviteList(info: any) {
  return request('GET', '/agent/user/invite/details', info)
}

/**
 * 获取邀请排行榜
 */
export function getInviteRanking(info: any) {
  return request('GET', '/agent/user/invite/rank', info)
}

/**
 * 获取首页消息
 */
export function getHomeMessage() {
  return request('POST', '/agent/user/delivery/order/simplelist')
}

/**
 * 获取用户详细信息(如生日,积分,骆驼币等)
 */
export function getUserInfo() {
  return request('GET', '/agent/user/detail')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: any) {
  return request('PUT', '/agent/user/updateInfo', data)
}

/**
 * 根据地址id查询代理商id
 */
export function getAgentIdByAddressId(id: string) {
  return request('GET', `/agent/user/agent/getAgentClearByAddressId?addressId=${id}`)
}

/**
 * 根据地址id查询商品分类
 */
export function getCatesByAddressId(info: any) {
  return request('GET', '/agent/user/agent/getCategoryListByAddressId', info)
}

/**
 * 根据数据字典获取banner图
 */
export function getBannerByCode(n: number) {
  const code = BANNER_CODE.get(n)
  return request('GET', `/agent/banner/list-by-item-code/${code}`)
}

/**
 * 获取分类列表
 */
export function getCateList(info: any) {
  return request('POST', '/agent/article/category/list', info)
}

/**
 * 获取编码
 */
export function getCode(id: string) {
  return request('GET', `/admin/qr/type/get?id=${id}`)
}

/**
 * 根据地址id查询代理商信息和分类
 */
export function getAgentAndCateByAddressId({ addressId, categoryType }: any) {
  return request('GET', `/agent/user/agent/getRecyclingInfoByAddressId?addressId=${addressId}&categoryType=${categoryType}`)
}

/**
 * 获取累计投递列表
 */
export function getDeliveryList(info: any) {
  return request('POST', '/agent/user/delivery/order/deliveryWeightList', info)
}

/**
 * 获取消息列表
 */
export function getUserNewsList(info: any) {
  return request('POST', '/agent/user/message/list', info)
}

/**
 * 获取报告详情
 */
export function getEcoReportDetail(info: { reportType: 'monthly' | 'quarterly' | 'yearly', period: string }) {
  return request('GET', '/agent/user/eco-report', info)
}

/**
 * 获取未读消息数量
 */
export function getUnreadTotal() {
  return request('GET', '/agent/user/message/unreadCount')
}

/**
 * 标记为已读
 */
export function markAsRead(id: string) {
  return request('POST', `/agent/user/message/markAsRead?id=${id}`)
}

/**
 * 获取微信打款免确认授权信息
 */
export function getWechatPayAuthInfo() {
  return request('GET', '/agent/user/withdraw/transfer-auth-info')
}

/**
 * 只有1,2会调接口
 * 点击合作(0: 无任何操作 1: 点击合作, 2: 点击加入我们 3. 提交合作申请)
 */
export function handleCooperate() {
  const token = uni.getStorageSync('token')
  if (!token) return null
  const cooperateLevel = uni.getStorageSync('cooperateLevel')
  if (!cooperateLevel) {
    uni.setStorageSync('cooperateLevel', 1)
    return request('POST', '/intention/record/cooperate')
  }
  if (cooperateLevel === 1) {
    uni.setStorageSync('cooperateLevel', 2)
    return request('POST', '/intention/record/join-us')
  }
  return null
}

/**
 * 个人投递榜(全平台)
 */
export async function getDeliveryRankList({ header, second, timeType = 'week', ...rest }: any) {
  console.log(rest)
  uni.showLoading({ title: '加载中...', icon: 'none' })
  let list, current
  try {
    if (header === 0 && second === 0) {
      const res = (await request('GET', '/agent/user/delivery/order/rankinglist/time/deliveryweight', { timeRange: timeType, ...rest })) || {}
      list = (res?.data?.rankingList || [])?.map((x: any) => ({
        rank: x?.rank,
        nickname: x?.userName,
        value: x?.totalWeight,
        level: x?.memberLevelName,
        avatar: x?.avatarUrl || DEFAULT_AVATAR,
        unit: 'kg'
      })).filter((m: any) => !m.isCurrentUser)
      const ob = res?.data?.currentUser || null
      current = ob?.rank
      ? {
        rank: ob?.rank,
        nickname: ob?.userName,
        value: ob?.totalWeight,
        level: ob?.memberLevelName,
        avatar: ob?.avatarUrl || DEFAULT_AVATAR,
        unit: 'kg',
        distance: ob?.distanceToPrev
      }
      : {}
    }
    if (header === 0 && second === 1) {
      const res = (await request('GET', '/agent/user/delivery/order/rankinglist/province/deliveryweight', { ...rest })) || {}
      list = (res?.data?.rankingList || []).map((x: any) => ({
        rank: x?.rank,
        nickname: x?.userName,
        value: x?.totalWeight,
        level: x?.memberLevelName,
        avatar: x?.avatarUrl || DEFAULT_AVATAR,
        unit: 'kg'
      })).filter((m: any) => !m.isCurrentUser)
      const ob = res?.data?.currentUser || null
      current = ob?.rank
      ? {
        rank: ob?.rank,
        nickname: ob?.userName,
        value: ob?.totalWeight,
        level: ob?.memberLevelName,
        avatar: ob?.avatarUrl || DEFAULT_AVATAR,
        unit: 'kg',
        distance: ob?.distanceToPrev
      }
      : {}
    }
    if (header === 0 && second === 2) {
      const res = (await request('GET', '/agent/user/delivery/order/rankinglist/community/deliveryweight', { ...rest })) || {}
      list = (res?.data?.rankingList || []).map((x: any) => ({
        rank: x?.rank,
        nickname: x?.userName,
        value: x?.totalWeight,
        level: x?.memberLevelName,
        avatar: x?.avatarUrl || DEFAULT_AVATAR,
        unit: 'kg'
      })).filter((m: any) => !m.isCurrentUser)
      const ob = res?.data?.currentUser || null
      current = ob?.rank
      ? {
        rank: ob?.rank,
        nickname: ob?.userName,
        value: ob?.totalWeight,
        level: ob?.memberLevelName,
        avatar: ob?.avatarUrl || DEFAULT_AVATAR,
        unit: 'kg',
        distance: ob?.distanceToPrev
      }
      : {}
    }
    if (header === 1 && second === 0) {
      const res = (await request('GET', '/agent/user/delivery/order/rankinglist/community/totalweight', { ...rest })) || {}
      list = (res?.data?.rankingList || []).map((x: any) => ({
        rank: x?.rank,
        nickname: x?.communityName,
        value: x?.deliveryCount,
        unit: 'kg'
      })).filter((m: any) => !m.isCurrentUser)
      const ob = res?.data?.currentUserCommunity || null
      current = ob?.rank
      ? {
        rank: ob?.rank,
        nickname: ob?.communityName,
        value: ob?.deliveryCount,
        unit: 'kg',
        distance: ob?.distanceToPrev
      }
      : {}
    }
    if (header === 1 && second === 1) {
      const res = (await request('GET', '/agent/user/delivery/order/rankinglist/community/usercount', { ...rest })) || {}
      list = (res?.data?.rankingList || []).map((x: any) => ({
        rank: x?.rank,
        nickname: x?.communityName,
        value: x?.userCount,
        unit: '人'
      })).filter((m: any) => !m.isCurrentUser)
      const ob = res?.data?.currentUserCommunity || null
      current = ob?.rank
      ? {
        rank: ob?.rank,
        nickname: ob?.communityName,
        value: ob?.userCount,
        unit: '人',
        distance: ob?.distanceToPrev
      }
      : {}
    }
    if (header === 2 && second === 0) {
      const res = (await request('GET', '/agent/user/invite/ranking', { timeType, ...rest })) || {}
      list = (res?.data?.rankingList || []).map((x: any) => ({
        rank: x?.rank,
        nickname: x?.nickname || '微信用户',
        value: x?.inviteCount,
        level: x?.titleName,
        avatar: x?.avatarUrl || DEFAULT_AVATAR,
        unit: '人',
        totalReward: x?.totalReward,
        phone: x?.phone
      })).filter((m: any) => !m.isCurrentUser)
      const ob = res?.data?.currentUser || null
      current = ob?.rank
      ? {
        rank: ob.rank,
        nickname: ob?.nickname || '微信用户',
        value: ob?.inviteCount,
        level: ob?.titleName,
        avatar: ob?.avatarUrl || DEFAULT_AVATAR,
        unit: '人',
        distance: ob?.distanceToPrev,
        phone: ob?.phone
      }
      : {}
    }
  } catch (error) {
    console.error(error)
  } finally {
    uni.hideLoading()
  }
  return { list, current }
}