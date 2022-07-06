import Axios from 'axios';
let baseURL = '';
if (import.meta.env.MODE  === 'development') {
  baseURL = 'http://localhost:3000/'
} else if (import.meta.env.MODE === 'production') {
  baseURL = 'http://localhost:3000/'
}
console.log(baseURL)
/*  防止请求重复
1. 我们需要对所有正在进行中的请求进行缓存。在请求发起前判断缓存列表中该请求是否正在进行，如果有则取消本次请求。
2.在任意请求完成后，需要在缓存列表中删除该次请求，以便可以重新发送该请求
*/

//正在请求的API队列
let requestList = []

/**
 * @name:  阻止请求
 * @param {array} requestList 当前API请求队列
 * @param {string} currentUrl  当前请求API
 * @param {function} cancelFn  请求中断函数
 * @param {string} errorMsg   中断错误信息
 */
 const stopRepeatRequest = (requestList, currentUrl, cancelFn, errorMsg) => {
  const errorMessage = errorMsg || '请求出错拥堵'
  for (let i = 0; i < requestList.length; i++) {
    if (requestList[i] === currentUrl) {
      cancelFn(errorMessage)
      return
    }
  }
  // 将当前请求加入执行队列
  requestList.push(currentUrl)
}

/**
 * @name:  请求完成后从队列删除当前请求
 * @param {array} requestList 当前API请求队列
 * @param {string} currentUrl  当前请求API
 */
 const allowRequest = (requestList, currentUrl) => {
  for (let i = 0; i < requestList.length; i++) {
    if (requestList[i] === currentUrl) {
      requestList.splice(i, 1)
      break
    }
  }
}

const instance = Axios.create({
  baseURL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
    'token': '',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 前置拦截器(发起请求前拦截)
instance.interceptors.request.use((config) => {
  // 这里根据你项目实际情况来对config做处理
  // 设置cancelToken
  let cancelFn = null;
  config.cancelToken = new Axios.CancelToken((c) => {
    cancelFn = c;
  })
  // 阻止重复请求
  stopRepeatRequest(requestList, config.url, cancelFn, `不要连续请求：${config.url}，速度太快了`)
  return config
}, (error) => {
  return Promise.reject(error)
})

// 后置拦截器(获取到响应式的拦截)
instance.interceptors.response.use((response) => {
  //不得重复发送
  setTimeout(() => {
    allowRequest(requestList, response.config.url), 1000
  })
  return response
}, (error) => {
  return Promise.reject(error)
})

// 对错误信息的处理函数
function handleErrorData(errMsg) {
  if (errMsg.message) {
    console.log(errMsg.message)
  } else {
    switch(errMsg.code) {
      case 401:
        console.log('未授权，重新登陆')
        break
      case 403:
        console.log('拒绝访问')
        break
      case 404:
        console.log('很抱歉，资源未找到')
        break
      case 500:
        console.log('服务器错误')
        break
      case 504:
        console.log('网络超时')
        break
      default:
        console.log('服务器正在联调中，请稍后')
        break
    }
  }
}

const ajaxMethod = ['get', 'post']
const api = {}
ajaxMethod.forEach(method => {
    api[method] = function (uri, data, config) {
        return new Promise(function (resolve, reject) {
            instance[method](uri, data, config)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    }
});

export default api;