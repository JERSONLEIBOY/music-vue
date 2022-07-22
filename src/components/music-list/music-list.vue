<template>
  <div class="music-list">
    <div class="music-top">
      <div
        class="back"
        @click="back"
      >
        <van-icon
          class="icon-back"
          name="arrow-left"
        />
      </div>
      <h1 class="title">{{ props.title }}</h1>
    </div>
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
          <van-icon
            class="icon-play"
            name="play-circle-o"
          />
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
    <scroll
      :data="props.songs"
      @scroll="handleScroll"
      :listenScroll="true"
      :probeType="3"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list
          :rank="props.rank"
          @select="selectItem"
          :songs="props.songs"
        ></song-list>
      </div>
      <div class="loading-container" v-show="!props.songs.length">
        <loading :dataStatus="'LOADING'"></loading>
      </div>
    </scroll>
  </div>
</template>

<script setup>
import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
import { reactive, getCurrentInstance, onMounted, computed, ref, watch } from 'vue';
import { prefixStyle } from "@/utils/dom.js"
import Scroll from '@/base/scroll/scroll.vue'
import SongList from "@/base/song-list/song-list.vue"
import Loading from "@/base/loading/loading.vue"
import { useRouter } from 'vue-router';
const storeActions = useStoreActions('storeState', ['selectPlay', 'randomPlay'])
const storeGetters = useStoreGetters('storeState', ['playlist'])
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");
const RESERVED_HEIGHT = 40;
const router = useRouter();
const list = ref(null);
const bgImage = ref(null);
const layer = ref(null);
const filter = ref(null)
const playBtn = ref(null)
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
  }),
  imageHeight: 0,
  minTranslateY: 0,
  scrollY: 0,
  playlist: computed(() => {
    return storeGetters.playlist.value
  })
})
watch(() => state.playlist, (newVal) => {
  console.log(newVal)
})
watch(() => state.scrollY, (newY) => {
  let translateY = Math.max(state.minTranslateY, newY);
  let zIndex = 0;
  let scale = 1;
  let blur = 0;
  layer.value.style[
    transform
  ] = `translate3d(0,${translateY}px,0)`;
  filter.value.style[backdrop] = `blur(${blur}px)`;

  const percent = Math.abs(newY / state.imageHeight);
  if (newY > 0) {
    scale = 1 + percent;
    zIndex = 10;
  } else {
    blur = Math.min(20, percent * 20);
  }
  if (newY < state.minTranslateY) {
    zIndex = 10;
    bgImage.value.style.paddingTop = 0;
    bgImage.value.style.height = `${RESERVED_HEIGHT}px`;
    playBtn.value.style.display = "none";
  } else {
    bgImage.value.style.paddingTop = "70%";
    bgImage.value.style.height = 0;
    playBtn.value.style.display = "";
  }
  bgImage.value.style[transform] = `scale(${scale})`;
  bgImage.value.style.zIndex = zIndex;
})
const random = () => { }
const back = () => {
  router.back();
}
const selectItem = (item, index) => {
  storeActions.selectPlay({
    list: props.songs,
    index
  })
  // console.log(storeGetters.playlist.value)
}
const handleScroll = (pos) => {
  state.scrollY = pos.y
}
onMounted(() => {
  state.imageHeight = bgImage.value.clientHeight;
  state.minTranslateY = -state.imageHeight + RESERVED_HEIGHT;
  list.value.$el.style.top = `${state.imageHeight}px`
})
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
  .music-top {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    .back {
      .icon-back {
        display: block;
        font-size: 22px;
        color: #ffcd32;
      }
    }
    .title {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      color: #fff;
    }
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
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid #ffcd32;
        color: #ffcd32;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: 16px;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
      }
    }
  }
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #222;
    overflow: inherit;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.bg-layer {
  position: relative;
  height: 100%;
  background: #222;
}
</style>