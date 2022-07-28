import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200


const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const insertArray = (arr, val, compare, maxLen) => {
  const index = arr.findIndex(compare)
  if (index == 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

const deleteFromArray = (arr, compare) => {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

const saveSearch = (query) => {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

const deleteSearch = (query) => {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

const clearSearch = () => {
  storage.remove(SEARCH_KEY)
  return []
}

const loadSearch = () => {
  return storage.get(SEARCH_KEY, [])
}

const loadFavorite = () => {
  return storage.get(FAVORITE_KEY, [])
}

const saveFavorite = (song) => {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

const deleteFavorite = (song) => {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

const savePlay = (song) => {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}


const loadPlay = () => {
  return storage.get(PLAY_KEY, [])
}

export {
  insertArray,
  deleteFromArray,
  saveSearch,
  deleteSearch,
  clearSearch,
  loadSearch,
  loadFavorite,
  saveFavorite,
  deleteFavorite,
  savePlay,
  loadPlay
}