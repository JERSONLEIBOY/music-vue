import { saveSearch, clearSearch, deleteSearch, saveFavorite, deleteFavorite } from '@/utils/cache'
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
  },
  saveFavoriteList: ({ commit }, song) => {
    return commit('SET_FAVORITE_LIST', saveFavorite(song))
  },
  deleteFavoriteList: ({ commit }, song) => {
    return commit('SET_FAVORITE_LIST', deleteFavorite(song))
  },
  setPlayingState: ({ commit }, playing) => {
    return commit('SET_PLAYING_STATE', playing)
  },
  setPlayMode: ({ commit }, mode) => {
    return commit('SET_PLAY_MODE', mode)
  },
  setPlaylist: ({ commit }, playlist) => {
    return commit('SET_PLAYLIST', playlist)
  },
  setCurrentIndex: ({ commit }, currentIndex) => {
    return commit('SET_CURRENT_INDEX', currentIndex)
  }
}
export default actions