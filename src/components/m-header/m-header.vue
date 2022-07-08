<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">vue-music</div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: #ffcd32;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background-image: url('../../assets/logo@3x.png');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: 18px;
  }
}
</style>