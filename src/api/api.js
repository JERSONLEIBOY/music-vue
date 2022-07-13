import api from "./axios";
// 获取热门歌手
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

export {
  login,
  logout,
  yzm,
  banner,
  getMusicList,
  topArtists,
  artistList
}