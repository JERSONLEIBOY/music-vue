import { saveSearch, clearSearch, deleteSearch } from '@/utils/cache'
import {playMode} from '@/utils/config'
import {shuffle} from '@/utils/index'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
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
  },
  setFullScreen: ({ commit }, fullScreen) => {
    return commit('SET_FULL_SCREEN', fullScreen)
  },
  selectPlay: ({ commit, state}, { list, index }) => {
    commit('SET_SEQUENCE_LIST', list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit('SET_PLAYLIST', randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit('SET_PLAYLIST', list)
    }
    commit('SET_CURRENT_INDEX', index)
    commit('SET_FULL_SCREEN', true)
    commit('SET_PLAYING_STATE', true)
    return;
  },
  randomPlay: ({ commit }, { list }) => {
    commit('SET_PLAY_MODE', playMode.random)
    commit('SET_SEQUENCE_LIST', list)
    let randomList = shuffle(list)
    commit('SET_PLAYLIST', randomList)
    commit('SET_CURRENT_INDEX', 0)
    commit('SET_FULL_SCREEN', true)
    commit('SET_PLAYING_STATE', true)
    return
  }
}
export default actions