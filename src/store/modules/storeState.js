import getters from '../getters'
import actions from '../actions'
const storeState = {
  namespaced: true,
  state: {
    isLogin: false
  },
  getters,
  mutations: {
    SET_ISLOGIN: (state, isLogin) => {
      state.isLogin = isLogin
    }
  },
  actions
}
export default storeState