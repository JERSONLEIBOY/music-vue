import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Lazyload } from 'vant';
import "@/assets/css/global.css"
import 'vant/es/toast/style';
import * as getApi from '@/api/api'
const app = createApp(App)
app.config.globalProperties['$http'] = getApi;
app.use(router)
app.use(store)
app.use(Lazyload)
app.mount("#app")
