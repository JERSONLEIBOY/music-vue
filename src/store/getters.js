const getters = {
  isLogin: state => state.isLogin,
  singer: state => state.singer,
  fullScreen: state => state.fullScreen,
  playing: state => state.playing,
  playlist: state => state.playlist,
  sequenceList: state => state.sequenceList,
  mode: state => state.mode,
  currentIndex: state => state.currentIndex,
  currentSong: (state) => {
    return state.playlist[state.currentIndex] || {}
  },
  disc: state => state.disc,
  topList: state => state.topList,
  searchHistory: state => state.searchHistory
}
export default getters