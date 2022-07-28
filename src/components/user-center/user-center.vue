<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="state.switches" :currentIndex="state.currentIndex"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="state.currentIndex === 0" :data="state.favoriteList">
          <div class="list-inner">
            <song-list :songs="state.favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="state.currentIndex === 1" :data="state.playHistory">
          <div class="list-inner">
            <song-list :songs="state.playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

import Switches from '@/base/switches/switches'
import Scroll from '@/base/scroll/scroll.vue'
import SongList from "@/base/song-list/song-list.vue"
import NoResult from '@/base/no-result/no-result.vue'

import { formatSongInfo } from '@/utils/song';
import { reactive, getCurrentInstance, onMounted, computed, ref, watch } from 'vue';
const { proxy } = getCurrentInstance();
import { Toast } from 'vant';

import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
const storeActions = useStoreActions('storeState', ['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory', 'insertSong', 'randomPlay'])
const storeState = useStoreState('storeState', ['searchHistory'])
const storeGetters = useStoreGetters('storeState', ['playlist', 'playHistory', 'favoriteList'])

const favoriteList = ref(null)
const playList = ref(null)
const listWrapper = ref(null)

const state = reactive({
  currentIndex: 0,
  switches: [
    {
      name: '我喜欢的'
    }, {
      name: '最近听的'
    }
  ],
  favoriteList: computed(() => {
    return storeGetters.favoriteList.value
  }),
  playHistory: computed(() => {
    return storeGetters.playHistory.value
  }),
  playlist: computed(() => {
    return storeGetters.playlist.value
  })
})

const handlePlaylist = (playlist) => {
  const bottom = playlist.length > 0 ? '60px' : ''
  listWrapper.value.style.bottom = bottom
  favoriteList.value && favoriteList.value.refresh()
  playList.value && playList.value.refresh()
}
watch(() => state.playlist, (newVal) => {
  console.log(newVal)
  handlePlaylist(newVal);
})

const noResult = computed(() => {
  if (state.currentIndex === 0) {
    return !state.favoriteList.length
  } else {
    return !state.playHistory.length
  }
})
const noResultDesc = computed(() => {
  if (state.currentIndex === 0) {
    return '暂无收藏歌曲'
  } else {
    return '你还没有听过歌曲'
  }
})

const switchItem = (index) => {
  state.currentIndex = index
}

const selectSong = (song) => {
  storeActions.insertSong(song)
}

const back = () => {
  router.back()
}

const random = () => {
  let list = state.currentIndex === 0 ? state.favoriteList : state.playHistory
  if (list.length === 0) return
  storeActions.randomPlay({
    list
  })
}

onMounted(() => {
  handlePlaylist(state.playlist)
})
</script>

<style lang="scss" scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #222;
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter-from, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  &.slide-leave-from, &.slide-enter-to {
    transform: translate3d(0, 0, 0);
  }
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
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.5);
    color: rgba(255,255,255,0.5);
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
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>