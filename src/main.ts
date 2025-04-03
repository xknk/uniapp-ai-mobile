
import { createSSRApp, Directive } from 'vue'
import App from './App.vue'
// import { createPinia } from 'pinia'
import { store } from "@/store/index";    // 引入创建好的pinia

// import piniaPersist from 'pinia-plugin-persist-uni'
import { Toast, ConfigProvider, Popover, Dialog, Search   } from 'vant'
import 'vant/es/toast/style'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import 'vant/es/dialog/style'
import 'vant/es/cell-group/style'
import 'vant/es/field/style'
import 'vant/es/cell/style'
import './assets/font/iconfont.css'; // 引入自定义图标样式文件

// const pinia = createPinia()
// pinia.use(piniaPersist)
const fixedInputDirective: Directive = {
	mounted(el) {
		el.addEventListener('focus', () => {
			const toTop = el.getBoundingClientRect().top - 10;
			setTimeout(() => {
				window.scrollTo({ top: toTop, behavior: 'smooth' });
			}, 100);
		})
	},
};
export function createApp() {
	const app = createSSRApp(App)
		// .use(pinia)
		.use(store)
		.use(Toast)
		.use(ConfigProvider)
		.use(Popover)
		.use(Dialog)
		.use(Search)
		.directive('fixed-input', fixedInputDirective);

	return {
		app,
	};
}