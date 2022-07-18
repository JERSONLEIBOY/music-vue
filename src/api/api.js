import api from "./axios";
// 排行榜
const toplist = () => { return api.get('/toplist', {}) }
const topListDetail = () => { return api.get('/toplist/detail', {}) }
const listDetail = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) }
// 获取热门歌手
const artists = ({ id = '' }) => { return api.get(`/artists?id=${id}`, {}) }
const topArtists = ({ limit = 30, offset = 0 }) => { return api.get(`/artists?limit=${limit}&offset=${offset}`, {}) }
const artistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0 }) => { return api.get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`, {}) }
// 获取歌单
const getMusicList = () => {
  return api.get(`/top/playlist?limit=10&order=hot&cat=&offset=0`, {})
}
// 轮播图
const banner = () => {
  return api.get(`/banner?type=2`, {})
}
// 登录接口
const login = (phone = '', captcha = '') => {
  return api.post(`/login/cellphone`, {
    phone,
    captcha: captcha,
  })
}
// 发送验证码
const yzm = (phone = '') => {
  return api.get(`/captcha/sent?phone=${phone}`, {})
}
// 退出登录
const logout = () => {
  return api.get(`/logout`, {})
}
// 热门搜索
const serachHot = () => { return api.get('/search/hot', {}) }
// 搜索
const search = ({ keywords = '' }) => { return api.get(`/search?keywords=${keywords}`, {}) }
export {
  login,
  logout,
  yzm,
  banner,
  getMusicList,
  topArtists,
  artistList,
  toplist,
  topListDetail,
  listDetail,
  artists,
  serachHot,
  search
}