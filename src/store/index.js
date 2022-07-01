import { createStore } from 'vuex'
import storeState from './modules/storeState'
export default createStore({
  modules: {
    storeState
  },
})