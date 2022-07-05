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
          <input type="number" placeholder="请输入手机号码">
        </div>
        <div class="input-item">
          <div class="tit">密码</div>
          <input type="number" placeholder="8-18位不含特殊字符的数字、字母组合">
        </div>
      </div>
      <div class="confirm-btn">登录</div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.container {
  padding-top: 115px;
  position: relative;
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
    &:before, &:after {
      display: block;
      content: "";
      width: 200px;
      height: 40px;
      background: #b4f3e2;
    }
    &:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
    &:after{
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
      left: -8px
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