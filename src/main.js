import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "@/assets/css/global.css"
import 'vant/es/toast/style';
import * as getApi from '@/api/api'
const app = createApp(App)
app.config.globalProperties['$http'] = getApi;
app.use(router)
app.use(store)
app.mount("#app")
