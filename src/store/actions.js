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
  },
  insertSong: ({ commit, state}, song) => {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playlist, song)
    // 因为是插入歌曲，所以索引+1
    currentIndex++
    // 插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含了这首歌
    if (fpIndex > -1) {
      // 如果当前插入的序号大于列表中的序号
      if (currentIndex > fpIndex) {
        playlist.splice(fpIndex, 1)
        currentIndex--
      } else {
        playlist.splice(fpIndex + 1, 1)
      }
    }
    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)
    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    commit('SET_PLAYLIST', playlist)
    commit('SET_SEQUENCE_LIST', sequenceList)
    commit('SET_CURRENT_INDEX', currentIndex)
    commit('SET_FULL_SCREEN', true)
    commit('SET_PLAYING_STATE', true)
    return
  },
  deleteSong: ({ commit, state }, song) => {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
      currentIndex--
    }
    commit('SET_PLAYLIST', playlist)
    commit('SET_SEQUENCE_LIST', sequenceList)
    commit('SET_CURRENT_INDEX', currentIndex)

    if (!playlist.length) {
      commit('SET_PLAYING_STATE', false)
    } else {
      commit('SET_PLAYING_STATE', true)
    }
    return
  },
  deleteSongList: ({ commit }) => {
    commit('SET_CURRENT_INDEX', -1)
    commit('SET_PLAYLIST', [])
    commit('SET_SEQUENCE_LIST', [])
    commit('SET_PLAYING_STATE', false)
    return
  }
}
export default actions