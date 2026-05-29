import { DEFAULT_AVATAR, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE_HORIZONTAL, PLACEHOLDER_IMAGE_RECYCLING_BIN } from './constrant'

const BASE_DATA = (() => ({
  code: 200,
  msg: 'success',
  data: {
    current: 1,
    pages: 1,
    size: 30,
    total: 1,
    records: []
  }
}))()
const BASE_DATA_INFO = (() => ({
  code: 200,
  msg: 'success',
  data: {}
}))()

export function mockDataFactory(url: string, data: any, param: any) {
  // if (url.includes('/user/delivery/order/listForUser')) {
  //   const info: any = BASE_DATA
  //   info.data = {
  //     ...info.data,
  //     records: Array.from({ length: 20 }).map(() => ({ orderSn: '222' }))
  //   }
  //   return info
  // }
  return data
}