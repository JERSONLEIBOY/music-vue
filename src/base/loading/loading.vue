<template>
  <div class="loading" :class="vertical ? 'vertical':''" v-if="dataStatus == 'LOADING'">
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
  <div v-if="dataStatus == 'NO_MORE_DATA'" class="loading">
    <p class="desc">我也是有底线的</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '加载中..'
  },
  vertical: {
    type: Boolean,
    default: false
  },
  dataStatus: {
    type: String,
    default: '',
  }
})
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  text-align: center;
  .desc {
    line-height: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
  &.vertical {
    display: flex;
    justify-content: center;
    align-items: center;
    .desc {
      padding-left: 8px;
    }
  }
}
</style>