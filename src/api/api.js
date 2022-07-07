import api from "./axios";

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
  yzm
}