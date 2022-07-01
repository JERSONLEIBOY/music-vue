import api from "./axios";

// 登录接口
const login = (phone = '', pwd = '') => {
  return api.post(`/login/cellphone`, {
    phone,
    password: pwd,
  })
}

// 退出登录
const logout = () => {
  return api.get(`/logout`, {})
}

export {
  login,
  logout
}