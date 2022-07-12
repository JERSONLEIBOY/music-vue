import api from "./axios";
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
  getMusicList
}