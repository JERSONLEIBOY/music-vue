<script setup>
    import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
    import { Toast } from 'vant';
    import 'vant/es/toast/style';
    const storeState = useStoreState('storeState', ['isLogin'])
    const storeActions = useStoreActions('storeState', ['setIsLogin'])
    const storeGetters = useStoreGetters('storeState', ['isLogin'])
    const changeName = () => {
      storeActions.setIsLogin(true)
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      console.log(storeActions)
      console.log(storeState)
    }
    console.log(storeState)
    console.log(storeActions)
    console.log(storeGetters)
</script>

<template>
  <div class="btn" @click="changeName">
    <span class="text">additionalData</span>
  </div>
  <van-button type="primary">主要按钮</van-button>
  <van-button type="primary" size="large">大号按钮</van-button>
  <van-button type="primary" size="normal">普通按钮</van-button>
  <van-button type="primary" size="small">小型按钮</van-button>
  <van-button type="primary" size="mini">迷你按钮</van-button>
</template>

<style lang="scss" scoped>
.btn {
  width: 100px;
  height: 100px;
  border-radius: 25px;
  background: red;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .text {
    color: #fff;
  }
}
</style>
