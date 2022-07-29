<template>
  <div class="container">
    <div class="left-bottom-sign"></div>
    <div class="right-top-sign"></div>
    <div class="wrapper">
      <div class="left-top-sign">LOGIN</div>
      <div class="welcome">欢迎回来！</div>
      <div class="input-content">
        <div class="input-item">
          <div class="tit">手机号码</div>
          <input
            type="phone"
            v-model="state.phone"
            placeholder="请输入手机号码"
          >
        </div>
        <div class="input-item">
          <div class="tit">验证码</div>
          <div class="input-yzm">
            <input
              type="number"
              v-model="state.captcha"
              placeholder="请输入验证码"
            >
            <div class="yzm" @click="getCode()" v-show="state.sendAuthCode">发送验证码</div>
            <div class="yzm" v-show="!state.sendAuthCode">{{state.second}}s</div>
          </div>
        </div>
      </div>
      <div
        class="confirm-btn"
        @click="submitForm"
      >登录</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';
import {useRouter} from 'vue-router'//导入vue-router
import { Toast } from 'vant';
const { proxy } = getCurrentInstance();
const router = useRouter();//使用router
console.log(proxy)
const state = reactive({
  phone: '',
  captcha: '',
  sendAuthCode: true,/* 布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
  second: 60, /* 一分钟 倒计时*/
  timer: null  /* 倒计时 计数器,防止点击的时候触发多个setInterval*/
})
const isSubmit = () => {
  if (state.phone == '') {
    Toast('请输入手机号码');
    return true
  } else if (state.captcha == '') {
    Toast('请输入验证码');
    return true;
  } else {
    return false;
  }
}
const submitForm = async () => {
  if (isSubmit()) return;
  const { data: res } = await proxy.$http.login(state.phone, state.captcha);
  console.log(res)
  if (res.code !== 200) {
    Toast(res.msg);
  } else {
    localStorage.setItem('token', res.token)
    let queryRedirectPath = '/recommend'
    if (router.currentRoute.value.query.redirect) {
      queryRedirectPath = router.currentRoute.value.query.redirect
    }
    router.replace({
      path: queryRedirectPath
    })
  }
}
/*-----------------------------------验证码----------------------------*/
/**
 * 发送验证码 === `点击按钮操作,点击按钮操作,点击按钮操作`
 * */
const getCode = async () => {
  if (state.sendAuthCode) {
    const { data: res } = await proxy.$http.yzm(state.phone);
    console.log(res)
    if (res.code != 200) {
      Toast(res.message);
      return
    } else {
      Toast('验证码已发送');
      state.sendAuthCode = false;
      let interval = window.setInterval(function () {
        setStorage(state.second);
        if (state.second-- <= 0) {
          /* 如果 倒计时完毕 重新赋值*/
          state.second = 60;
          state.sendAuthCode = true;
          window.clearInterval(interval);
        }
      }, 1000);
    }
  }
}
/**
 * 存储 验证码 防止刷新
 * `用处`: 防止页面刷新 发送验证码状态改变
 * */
const setStorage = (parm) => {
  localStorage.setItem("dalay", parm);
  localStorage.setItem("_time", new Date().getTime());
};
const removeStorage = () => {
  localStorage.removeItem("dalay");
  localStorage.removeItem("_time");
}
/**
 * 获取 缓存 数据
 * `用处`: 防止页面刷新 发送验证码状态改变
 * */
const getStorage = () => {
  let localDelay = {};
  localDelay.delay = localStorage.getItem("dalay");
  localDelay.sec = localStorage.getItem("_time");
  return localDelay;
}
/**
 *  判断
 *  */
const judgeCode = () => {
  // 获取缓存中的数据
  let localDelay = getStorage();
  let secTime = parseInt(
    (new Date().getTime() - localDelay.sec) / 1000
  );
  if (secTime > localDelay.delay) {
    state.sendAuthCode = true;
    removeStorage();
  } else {
    state.sendAuthCode = false;
    let _delay = localDelay.delay - secTime;
    state.second = _delay;
    state.timer = setInterval(() => {
      if (_delay > 1) {
        _delay--;
        setStorage(_delay);
        state.second = _delay;
        state.sendAuthCode = false;
      } else {
        // 让浏览器打开的时候,显示剩余的时间
        state.sendAuthCode = true;
        window.clearInterval(state.timer);
      }
    }, 1000);
  }
}

/**
 * 页面执行
 */
judgeCode()
/*-----------------------------------验证码----------------------------*/
</script>

<style lang="scss" scoped>
.container {
  padding-top: 115px;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  .left-bottom-sign {
    position: absolute;
    left: -135px;
    bottom: -160px;
    border: 50px solid #d0d1fd;
    border-radius: 50%;
    padding: 90px;
  }
  .right-top-sign {
    position: absolute;
    top: 40px;
    right: -15px;
    z-index: 95;
    &:before,
    &:after {
      display: block;
      content: "";
      width: 200px;
      height: 40px;
      background: #b4f3e2;
    }
    &:before {
      transform: rotate(50deg);
      border-radius: 0 50px 0 0;
    }
    &:after {
      position: absolute;
      right: -100px;
      top: 0;
      transform: rotate(-50deg);
      border-radius: 50px 0 0 0;
    }
  }
  .wrapper {
    position: relative;
    z-index: 90;
    background: #fff;
    padding-bottom: 20px;
    .left-top-sign {
      font-size: 60px;
      color: #f8f8f8;
      position: relative;
      left: -8px;
    }
    .welcome {
      position: relative;
      left: 25px;
      top: -45px;
      font-size: 23px;
      color: #555;
      text-shadow: 1px 0px 1px rgb(0 0 0 / 30%);
    }
    .input-content {
      padding: 0 30px;
      .input-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 15px;
        background: #f8f6fc;
        height: 60px;
        border-radius: 4px;
        margin-bottom: 25px;
        .tit {
          height: 25px;
          line-height: 28px;
          font-size: 13px;
          color: #606266;
        }
        input {
          height: 30px;
          font-size: 15px;
          color: #303133;
          width: 100%;
          border: none;
          background: none;
        }
        .input-yzm {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          .yzm {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25px;
            padding: 0 5px;
            color: #606266;
            font-size: 13px;
            white-space: nowrap;
          }
        }
      }
    }
    .confirm-btn {
      width: 315px;
      height: 38px;
      line-height: 38px;
      border-radius: 50px;
      margin: 35px auto 0;
      background: #fa436a;
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>