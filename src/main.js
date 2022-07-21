import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Lazyload } from 'vant';
import "@/assets/css/global.css"
import "@/assets/css/icon.css"
import 'vant/es/toast/style';
import * as getApi from '@/api/api'
import util from '@/utils/util'
const app = createApp(App)
app.config.globalProperties['$http'] = getApi;
app.config.globalProperties['$utils'] = util;
app.use(router)
app.use(store)
app.use(Lazyload)
app.mount("#app")
