/**
 * 从 URL 中获取查询参数
 * @param {string} [url] - 要解析的 URL
 * @returns {object} 包含所有查询参数的对象
 */
export function getQueryParams(url: string) {
	// 如果没有提供 URL，则使用当前页面的 URL
	const queryString = url ? url.split('?')[1] : ''
	if (!queryString) return {}
	const params: { [key: string]: any } = {}
	const pairs = queryString.split('&')
	for (const pair of pairs) {
		const [key, value] = pair.split('=')
		if (key) {
			// 解码 URL 编码的字符
			const decodedKey = key
			const decodedValue = value ? value.replace(/\+/g, ' ') : ''

			// 处理重复参数（转换为数组）
			if (decodedKey in params) {
				if (Array.isArray(params[decodedKey])) {
					params[decodedKey].push(decodedValue)
				} else {
					params[decodedKey] = [params[decodedKey], decodedValue]
				}
			} else {
				params[decodedKey] = decodedValue
			}
		}
	}

	return params
}

/**
 * 获取单个查询参数的值
 * @param {string} name - 要获取的参数名
 * @param {string} [url] - 可选参数，要解析的 URL
 * @returns {string|Array|null} 参数值（如果参数重复则返回数组，不存在返回 null）
 */
export function getQueryParam(name: string, url: string): string | Array<any> | null {
	const params: { [key: string]: any } = getQueryParams(url)
	return params[name] !== undefined ? params[name] : null
}

/**
 * 处理小数精度问题
 * @param {number} num - 要处理的数字
 * @param {number} [precision] - 保留的小数位数，默认为12位
 * @returns {number} 处理后的数字
 */
export function fixPrecision(num: number, precision: number = 12): number {
	// 检查输入是否为有效数字
	if (typeof num !== 'number' || isNaN(num)) {
		throw new TypeError('输入必须是一个有效的数字')
	}

	// 处理精度参数
	if (typeof precision !== 'number' || precision < 0 || precision % 1 !== 0) {
		throw new TypeError('精度必须是一个非负整数')
	}

	// 特殊情况处理：整数或精度为0时直接取整
	if (precision === 0) {
		return Math.round(num)
	}

	// 使用科学计数法避免浮点数运算问题
	const multiplier = 10 ** precision
	const adjustedNum = (Math.round(num * multiplier) / multiplier).toFixed(precision)

	// 转换为数字类型返回，避免返回字符串
	return parseFloat(adjustedNum)
}

/**
 * 电话号码加*
 */
export function formatPhone(phone: string): string {
	if (!phone) return ''
	return phone.length >= 11 ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : phone
}

/**
 * 获取用户定位(经纬度)
 */
export function getAddress(cb: any) {
	uni.getLocation({
		type: 'wgs84',
		success: cb,
		fail: () => uni.showToast({ title: '请开通定位权限', icon: 'error' })
	})
}

/**
 * 获取投递状态文本
 */
export function getDeliveryStatusText(status: number, usageRate: number) {
	if (status === 1) return '暂停使用'
	if (usageRate >= 120) return '已满'
	return '可投'
}

/**
 * 防抖：连续触发时，仅在最后一次触发后等待指定时间再执行
 */
export function debounce(fn: any, time: number) {
	let timer: any = null
	return function (this: any, ...args: any[]) {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
			timer = null
		}, time)
	}
}

/**
 * 获取地址解析(如四川省/成都市/武侯区/xx街道xx号)
 */
export function parseSmartAddress(fullAddress: string) {
	const munReg = /^(北京|天津|上海|重庆)市(.+?[区|县])?(.+)$/
	const munMatch = fullAddress.match(munReg)
	if (munMatch) {
		return {
			province: `${munMatch[1]}市`,
			city: `${munMatch[1]}市`,
			region: munMatch[2] || '',
			addressDetail: munMatch[3] || ''
		}
	}
	const normReg = /^(.+?[省|自治区])(.+?[市|自治州地区盟])(.+?[区|县市])?(.+)$/
	const normMatch = fullAddress.match(normReg)
	return {
		province: normMatch?.[1] || '',
		city: normMatch?.[2] || '',
		region: normMatch?.[3] || '',
		addressDetail: normMatch?.[4] || ''
	}
}

/**
 * 格式化数字
 * 27.0000001 -> 27 / 27.10 -> 27.1 / 27 -> 27
 */
export function formatNumber(num: number) {
	return +(num || 0).toFixed(2) * 100 / 100
}

/**
 * 获取刚刚/几分钟/几小时/几天前
 */
export function timeAgo(input: string) {
	if (!input) return ''
	const normalized = input.replace(/-/g, '/') // 兼容部分环境的日期解析
	const target = new Date(normalized).getTime()
	const now = Date.now()
	const diff = now - target
	if (diff <= 0) return '刚刚'
	const minute = 60 * 1000
	const hour = 60 * minute
	const day = 24 * hour
	if (diff < minute) {
		return '刚刚'
	} else if (diff < hour) {
		const m = Math.floor(diff / minute)
		return `${m}分钟前`
	} else if (diff < day) {
		const h = Math.floor(diff / hour)
		return `${h}小时前`
	} else {
		const d = Math.floor(diff / day)
		return `${d}天前`
	}
}

/**
 * 获取距离未来时间MM:SS
 */
export function getCountDown(time: string) {
	const formatTime = time.replace(/-/g, '/')
	const now = Date.now()
	const target = new Date(formatTime).getTime()
	if (isNaN(target) || target <= now) return '00:00'
	const diffSec = Math.floor((target - now) / 1000)
	const m = Math.floor(diffSec / 60)
	const s = diffSec % 60
	const pad = (num: number) => num < 10 ? `0${num}` : num
	return `${pad(m)}:${pad(s)}`
}

/**
 * 图片预览(单张)
 */
export function previewImage(image: string) {
	uni.previewImage({
		urls: [image],
		current: 0
	})
}

/**
 * 消息订阅 withdrawal(提现)、delivery(投递)、onsite(上门)、mall(发货)、feedback(反馈)
 */
export function subscribe(type: 'withdrawal' | 'delivery' | 'onsite' | 'mall' | 'feedback', fn?: () => void) {
	let tmplIds: string[] = []
	if (type === 'withdrawal') tmplIds = ['8-QnOtAeXqIaKoqPusS3aTKpyAH7_MU2NDpEDSoWiXA']
	if (type === 'delivery') tmplIds = ['HM_sR56pqz5w1OANytcEESi3Lwv9b_XJpI33oSg6rYw']
	if (type === 'onsite') tmplIds = ['ZhuomP_9Coa1lsq2DnKjiWTCji89vchPF0NDspnJO_8', 'HM_sR56pqz5w1OANytcEESi3Lwv9b_XJpI33oSg6rYw', 'WwYTd7MOkY1IB92x7GTrbZcWmcRh3TuBwa6axDHXppQ']
	if (type === 'mall') tmplIds = ['u0p1DkOc0m1xPVNswA5Wjut8qrlUjt_k1b4YZj-JyNw']
	if (type === 'feedback') tmplIds = ['0gZryCCYSbGDqZDbfjOARIyFmfXPEmY-fFLR4tnMhQg']
	console.log(type, tmplIds)
	uni.requestSubscribeMessage({
    tmplIds,
    success(e) {
			console.log(e)
		},
    fail(e) {
			console.log(e)
		},
		complete() {
			fn?.()
		} 
  })
}