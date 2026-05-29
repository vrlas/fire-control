export interface PosterData {
  productImage: string
  categoryName: string
  avatarUrl: string
  nickname: string
  deliveryWeight: string | number
  camelCoin: string | number
  point: string | number
  qrcodeImage: string
}

function loadImage(canvas: any, src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        const img = canvas.createImage()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = res.path
      },
      fail: reject
    })
  })
}

export async function generatePoster(canvas: any, data: PosterData): Promise<string> {
  const dpr = uni.getSystemInfoSync().pixelRatio
  const W = 660
  const IMG_H = 540
  const USER_H = 130
  const GREEN_H = 200
  const H = IMG_H + USER_H + GREEN_H

  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const [prodImg, avatarImg, qrImg] = await Promise.all([
    loadImage(canvas, data.productImage),
    loadImage(canvas, data.avatarUrl),
    loadImage(canvas, data.qrcodeImage)
  ])

  // 白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // 商品图 aspectFill
  const ratio = Math.max(W / prodImg.width, IMG_H / prodImg.height)
  const sw = W / ratio
  const sh = IMG_H / ratio
  const sx = (prodImg.width - sw) / 2
  const sy = (prodImg.height - sh) / 2
  ctx.drawImage(prodImg, sx, sy, sw, sh, 0, 0, W, IMG_H)

  // 分类名遮罩
  ctx.fillStyle = 'rgba(112, 111, 111, 0.27)'
  ctx.fillRect(0, IMG_H - 74, W, 74)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(data.categoryName, W / 2, IMG_H - 37)

  // 用户头像 + 昵称水平居中
  const avatarSize = 80
  const gap = 20
  ctx.font = '30px sans-serif'
  const nameW = ctx.measureText(data.nickname).width
  const groupW = avatarSize + gap + nameW
  const groupX = (W - groupW) / 2
  const centerY = IMG_H + USER_H / 2

  ctx.save()
  ctx.beginPath()
  ctx.arc(groupX + avatarSize / 2, centerY, avatarSize / 2, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(avatarImg, groupX, centerY - avatarSize / 2, avatarSize, avatarSize)
  ctx.restore()

  ctx.fillStyle = '#3B3B3B'
  ctx.font = '30px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(data.nickname, groupX + avatarSize + gap, centerY)

  // 绿色底栏
  const greenY = IMG_H + USER_H
  ctx.fillStyle = '#43CF7C'
  ctx.fillRect(0, greenY, W, GREEN_H)

  ctx.fillStyle = '#3B3B3B'
  ctx.font = '28px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(`投递重量 ${data.deliveryWeight}kg`, 46, greenY + 50)
  ctx.fillText(`获得骆驼币 ${data.camelCoin}`, 46, greenY + 100)
  ctx.fillText(`获得积分 ${data.point}`, 46, greenY + 150)

  // 二维码白底圆角
  const qrSize = 100
  const qrPad = 6
  const qrBox = qrSize + qrPad * 2
  const qrX = W - 46 - qrBox
  const qrY = greenY + (GREEN_H - qrBox) / 2
  const r = 12
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(qrX + r, qrY)
  ctx.arcTo(qrX + qrBox, qrY, qrX + qrBox, qrY + qrBox, r)
  ctx.arcTo(qrX + qrBox, qrY + qrBox, qrX, qrY + qrBox, r)
  ctx.arcTo(qrX, qrY + qrBox, qrX, qrY, r)
  ctx.arcTo(qrX, qrY, qrX + qrBox, qrY, r)
  ctx.closePath()
  ctx.fill()
  ctx.drawImage(qrImg, qrX + qrPad, qrY + qrPad, qrSize, qrSize)

  return new Promise((resolve, reject) => {
    (uni.canvasToTempFilePath as any)({
      canvas,
      width: W,
      height: H,
      destWidth: W,
      destHeight: H,
      fileType: 'jpg',
      quality: 1,
      success: (res: any) => resolve(res.tempFilePath),
      fail: reject
    })
  })
}
