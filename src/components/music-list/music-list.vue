<template>
  <div class="music-list">
    <div class="back" @click="back">
      <van-icon
        class="icon-back"
        name="arrow-left"
      />
    </div>
    <h1 class="title">{{props.title}}</h1>
    <div
      class="bg-image"
      :style="state.bgStyle"
      ref="bgImage"
    >
      <div class="play-wrapper">
        <div
          class="play"
          v-show="props.songs.length"
          ref="playBtn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        ref="filter"
      ></div>
    </div>
    <div
      class="bg-layer"
      ref="layer"
    ></div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  bgImage: {
    type: String,
    default: ""
  },
  songs: {
    type: Array,
    default: []
  },
  title: {
    type: String,
    default: ""
  },
  rank: {
    type: Boolean,
    default: false
  }
})
const state = reactive({
  bgStyle: computed(() => {
    return `background-image:url(${props.bgImage})`
  })
})
const random = () => {}
const back =() => {
  router.back();
}
</script>

<style lang="scss" scoped>
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #222;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: 22px;
      color: #ffcd32;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: #222;
  }
}
</style>