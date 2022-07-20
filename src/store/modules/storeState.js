import getters from '../getters'
import actions from '../actions'
import { loadSearch } from '@/utils/cache'
const storeState = {
  namespaced: true,
  state: {
    isLogin: false,
    searchHistory: loadSearch()
  },
  getters,
  mutations: {
    SET_ISLOGIN: (state, isLogin) => {
      state.isLogin = isLogin
    },
    SET_SEARCH_HISTORY: (state, searchHistory) => {
      state.searchHistory = searchHistory
    }
  },
  actions
}
export default storeState