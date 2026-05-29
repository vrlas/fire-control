/**
 * 验证手机号
 * @param {string} phone - 手机号码
 * @returns {boolean} 验证结果
 */
function verifyPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(phone.trim())
}

function verifyIdCardCheckCode(idCard: string): boolean {
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += Number.parseInt(idCard[i]) * weights[i]
  }
  const checkCodeIndex = sum % 11
  return idCard[17] === checkCodes[checkCodeIndex]
}

/**
 * 验证身份证号
 */
function verifyIdCard(idCard: string): boolean {
  if (!idCard || typeof idCard !== 'string') return false
  const idCardStr = idCard.trim().toUpperCase()
  // 18位身份证正则
  const idCardReg18 = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i
  // 15位身份证正则（旧版）
  const idCardReg15 = /^[1-9]\d{7}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}$/
  if (idCardReg18.test(idCardStr)) return verifyIdCardCheckCode(idCardStr)
  return idCardReg15.test(idCardStr)
}

/**
 * 验证邮箱
 */
function verifyEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailReg = /^[\w.-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  return emailReg.test(email.trim())
}

export const VerifyUtils = {
  verifyPhone, // 验证手机号
  verifyIdCard, // 验证身份证号(18位和15位身份证)
  verifyEmail // 验证邮箱
}