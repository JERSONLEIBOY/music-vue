import { saveSearch, clearSearch, deleteSearch } from '@/utils/cache'
const actions = {
  setIsLogin: ({ commit }, isLogin) => {
    return commit('SET_ISLOGIN', isLogin)
  },
  saveSearchHistory: ({ commit }, query) => {
    return commit('SET_SEARCH_HISTORY', saveSearch(query))
  },
  deleteSearchHistory: ({ commit }, query) => {
    return commit('SET_SEARCH_HISTORY', deleteSearch(query))
  },
  clearSearchHistory: ({ commit }, query) => {
    return commit('SET_SEARCH_HISTORY', clearSearch())
  }
}
export default actions