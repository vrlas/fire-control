import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

const originalNavigateTo = uni.navigateTo

uni.navigateTo = function (options: UniApp.NavigateToOptions) {
  const url = options.url || ''
  const token = uni.getStorageSync('token')
  const guardList = [
    '/pages/my/withdrawal/withdrawal',
    '/pages/my/accountSettings/accountSettings',
		'/pages/my/deliveryCode/deliveryCode',
		'/pages/my/news/news',
		'/pages/my/environmentalProtectionPoints/environmentalProtectionPoints',
		'/pages/my/myOrder/myOrder',
		'/pages/recycle/recyclingBinsDetails/recyclingBinsDetails',
		'/pages/delivery/rank',
		'/pages/community/communityNews/communityNews',
		'/pages/my/cumulativeDelivery/cumulativeDelivery'
  ]
  const isAuth = guardList.some((path: string) => url.startsWith(path))
  if (!token && isAuth) {
    return uni.redirectTo({ url: '/pages/login/index' })
  }
	return originalNavigateTo(options)
}

export function createApp() {
	const app = createSSRApp(App)
	const pinia = createPinia()
	app.use(pinia)

	return {
		app,
		pinia
	}
}
