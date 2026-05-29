/**
 * 默认头像
 */
export const DEFAULT_AVATAR = 'https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/user/userAdvater.png'

/**
 * 占位图片
 */
export const PLACEHOLDER_IMAGE = 'https://img.js.design/assets/img/6850c60fe568a80f77cece73.png'

/**
 * 横向占位图
 */
export const PLACEHOLDER_IMAGE_HORIZONTAL = 'https://img.js.design/assets/img/685ceb86382c21c8b9f2c0b3.png'

/**
 * 回收箱占位图
 */
export const PLACEHOLDER_IMAGE_RECYCLING_BIN = 'https://img.js.design/assets/img/69051eefd56431f9d62279b6.png'

/**
 * 图片上传展位图(默认图片)
 */
export const PLACEHOLDER_IMAGE_UPLOAD = 'https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/index/defaultpicture.png'

/**
 * 二维码占位图
 */
export const QRCODE_IMAGE = 'https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/2026-03-13/2032290936960192512.png'

/**
 * 默认昵称
 */
export const DEFAULT_NICKNAME = '微信用户'

/**
 * 默认回收箱图片
 */
export const DEFAULT_BIN_IMG = 'https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/2026-04-18/2045385186908180480.png'

/**
 * 图片最大上传数量
 */
export const MAX_UPLOAD_IMAGES = 5

/**
 * 查询参数(避免内存共享问题)
 */
export function BASIC_QUERY_INFO() {
  return {
    page: 1,
    size: 30,
    sort: [],
    keyword: {}
  }
}

/**
 * banner图编码对应数据字段(后期这儿填入b端对应的数据字典)
 */
export const BANNER_CODE = new Map([
  [0, 'FRONT_PAGE'], // 用户端首页-轮播图
  [1, 'RECYCLABLES'], // 可回收物科普
  [2, 'CONVENIENC_SERVE'], // 便民服务
  [3, 'ONLINE_CUSTOMER'], // 在线客服
  [4, 'PARTNERSHIP'], // 合作加盟
  [5, 'PARTNERSHIP_DESC'], // 合作结盟说明
  [6, 'WITHDRAWAL_BANNER'], // 提现页面横幅
  [7, 'WITHDRAWAL_WECHAT_ACCOUNT'], // 提现页面公众号
  [8, 'INVITE_FRIENDS'], // 邀请好友背景
  [9, 'WECHAT_ACCOUNT_BACKGROUND'], // 公众号背景
  [10, 'NEARBY_BINS'], // 附近回收箱
  [11, 'SplashScreen'] // 闪屏
])

/**
 * 明细类型
 */
export const SOURCE_MAP = new Map([
  [1, '上门订单'],
  [2, '后台调整'],
  [3, '投递订单'],
  [4, '成长任务'],
  [5, '用户提现'],
  [6, '社区分享奖励'],
  [7, '签到'],
  [8, '商城下单抵扣'],
  [9, '商城订单取消退回'],
  [10, '邀请注册'],
  [11, '违规扣减'],
  [12, '二次收益返佣'],
  [13, '商城订单退款']
])

/**
 * 便民服务图标/文字
 */
export const SERVICE_LIST = [
  {
    imageUrl: '/static/image/convenienceServices/1-洗衣机@3x.png',
    text: '家电清洗',
    color: '#FB6567'
  },
  {
    imageUrl: '/static/image/convenienceServices/2-家政@3x.png',
    text: '家政服务',
    color: '#5290FB'
  },
  {
    imageUrl: '/static/image/convenienceServices/3-严选@3x.png',
    text: '骆驼严选',
    color: '#FB8D5B'
  },
  {
    imageUrl: '/static/image/convenienceServices/4-上门@3x.png',
    text: '上门做饭',
    color: '#25DCA2'
  },
  {
    imageUrl: '/static/image/convenienceServices/5-上门安装@3x.png',
    text: '上门安装',
    color: '#FB8D5B'
  },
  {
    imageUrl: '/static/image/convenienceServices/6-拉货@3x.png',
    text: '拉货搬家',
    color: '#25DCA2'
  },
  {
    imageUrl: '/static/image/convenienceServices/7-开锁@3x.png',
    text: '开门换锁',
    color: '#FB6567'
  },
  {
    imageUrl: '/static/image/convenienceServices/8-陪诊@3x.png',
    text: '陪诊就医',
    color: '#5290FB'
  }
]

/**
 * 订单权限控制
 */
export const ORDER_AUTH_MAP = new Map([
  ['onsite', new Map([
    [1, { name: '已提交', auth: [], class: 'u-tag green' }],
    [2, { name: '待接单', auth: [], class: 'u-tag orange' }],
    [3, { name: '待回收', auth: [], class: 'u-tag orange' }],
    [4, { name: '已完成', auth: [], class: 'u-tag green' }],
    [5, { name: '已取消', auth: [], class: 'u-tag gray' }],
    [6, { name: '已完成', auth: [], class: 'u-tag green' }],
    [7, { name: '已完成', auth: [], class: 'u-tag green' }],
    [8, { name: '已完成', auth: [], class: 'u-tag green' }],
    [9, { name: '已完成', auth: [], class: 'u-tag green' }]
  ])],
  ['deliver', new Map([
    [0, { name: '已投递', auth: [], class: 'u-tag green' }],
    [1, { name: '已投递', auth: [], class: 'u-tag green' }],
    [2, { name: '审核中', auth: [], class: 'u-tag orange' }],
    [3, { name: '已完成', auth: [], class: 'u-tag green' }],
    [4, { name: '异常单', auth: [], class: 'u-tag orange' }],
    [5, { name: '已完成', auth: [], class: 'u-tag green' }],
    [6, { name: '已驳回', auth: [], class: 'u-tag orange' }]
  ])],
  ['mall', new Map([
    [1, { name: '待支付', auth: ['取消订单', '去支付'], class: 'u-tag orange' }],
    [2, { name: '待发货', auth: ['联系客服'], class: 'u-tag orange' }],
    [3, { name: '待收货', auth: ['联系客服', '确定收货'], class: 'u-tag orange' }],
    [4, { name: '已完成', auth: ['再次购买'], class: 'u-tag green' }],
    [5, { name: '已取消', auth: ['再次购买'], class: 'u-tag gray' }],
    [6, { name: '已退款', auth: [], class: 'u-tag gray' }]
  ])]
])

/**
 * 提现记录状态信息
 */
export const GET_WITHDRAW_STATUS_META = new Map([
  [1, {
    label: '待审核',
    bg: 'linear-gradient(135deg, rgba(255, 184, 77, 1) 0%, rgba(255, 146, 62, 1) 100%)'
  }],
  [2, {
    label: '待确认',
    bg: 'linear-gradient(135deg, rgba(94, 210, 137, 1) 0%, rgba(48, 191, 113, 1) 100%)'
  }],
  [3, {
    label: '已驳回',
    bg: 'linear-gradient(135deg, rgba(255, 126, 126, 1) 0%, rgba(245, 86, 86, 1) 100%)'
  }],
  [4, {
    label: '已完成',
    bg: 'linear-gradient(135deg, rgba(92, 173, 255, 1) 0%, rgba(73, 144, 255, 1) 100%)'
  }]
])

/**
 * 订阅信息
 */
export const SUBSCRIBE_INFO = new Map([
  [1, { name: '提现结果通知', id: '8-QnOtAeXqIaKoqPusS3aTKpyAH7_MU2NDpEDSoWiXA' }],
  [2, { name: '投递订单通知', id: 'HM_sR56pqz5w1OANytcEESi3Lwv9b_XJpI33oSg6rYw' }],
  [3, { name: '上门接单通知', id: 'ZhuomP_9Coa1lsq2DnKjiWTCji89vchPF0NDspnJO_8' }],
  [4, { name: '上门审核通知', id: 'HM_sR56pqz5w1OANytcEESi3Lwv9b_XJpI33oSg6rYw' }],
  [5, { name: '上门取消通知', id: 'WwYTd7MOkY1IB92x7GTrbZcWmcRh3TuBwa6axDHXppQ' }],
  [6, { name: '商城发货通知', id: 'u0p1DkOc0m1xPVNswA5Wjut8qrlUjt_k1b4YZj-JyNw' }],
  [7, { name: '意见反馈通知', id: '0gZryCCYSbGDqZDbfjOARIyFmfXPEmY-fFLR4tnMhQg' }]
])

/**
 * 报告描述
 */
export const REPORT_DESCRIPTION = new Map([
  ['MONTH_REPORT', { title: '月度报告', path: '/pages/my/news/monthReport' }],
  ['QUARTER_REPORT', { title: '季度报告', path: '/pages/my/news/quarterReport' }],
  ['YEAR_REPORT', { title: '年度报告', path: '/pages/my/news/yearReport' }]
])

/**
 * 默认未登录展示
 */
export const NO_LOGIN_DATA = {
  amount: '***',
  availablePoints: '15205',
  avatar: 'https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/user/userAdvater.png',
  avatarUrl: 'https://hengningxinxi.oss-cn-chengdu.aliyuncs.com/test/details/user/userAdvater.png',
  birthday: '2000-02-28 00:00:00',
  cachedStreak: '***',
  camelCoin: '***',
  coinAmountRatio: '***',
  createDays: '***',
  createTime: '2026-04-10 15:35:14',
  departmentId: '***',
  expiredPoints: '***',
  expiringPoints: '***',
  gender: 1,
  historyCamelCoin: 16.3,
  historyPoints: '***',
  id: '***',
  inviteCount: '***',
  isBlock: '***',
  isDelete: '***',
  minWithdrawalAmount: 0.1,
  nickname: '默认用户',
  pendingCredit: '***',
  pendingWithdraw: '***',
  phone: '***',
  points: '***',
  referralTitle: '暂无',
  registerTime: '***',
  signDays: '***',
  status: 1,
  streakCacheDate: '2026-05-06 00:00:00',
  tag: '',
  titleName: '环保菜鸟',
  totalCamelCoin: '***',
  totalCamelCoinDeduct: '***',
  totalDelivery: '***',
  totalPerformance: '***',
  totalPointDeduct: '***',
  totalPoints: '***',
  totalWithdraw: '***',
  type: 2,
  unAddCamelCoin: '***',
  usedPoints: '***',
  userId: '***',
  username: 'okWFX12iES1I6yV02lqRAFFsRawE',
  version: '***',
  violationCount: '***',
  withdrawn: '***',
  totalRecycleWeight: 0,
  memberLevelConfig: {
    name: '环保菜鸟'
  }
}

/**
 * 时间类型(排行榜使用)
 */
export const TimeTypes = [
  { label: '今日', value: 'day' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '全部', value: 'all' }
]

/**
 * 省(排行榜使用)
 */
export const ProvinceTypes = [
  '四川省',
  '北京市',
  '天津市',
  '河北省',
  '山西省',
  '内蒙古自治区',
  '辽宁省',
  '吉林省',
  '黑龙江省',
  '上海市',
  '江苏省',
  '浙江省',
  '安徽省',
  '福建省',
  '江西省',
  '山东省',
  '河南省',
  '湖北省',
  '湖南省',
  '广东省',
  '广西壮族自治区',
  '海南省',
  '重庆市',
  '贵州省',
  '云南省',
  '西藏自治区',
  '陕西省',
  '甘肃省',
  '青海省',
  '宁夏回族自治区',
  '新疆维吾尔自治区',
  '台湾省',
  '香港特别行政区',
  '澳门特别行政区'
]