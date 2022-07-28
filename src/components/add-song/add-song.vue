<template>
  <transition name="slide">
    <div class="add-song" v-show="state.showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!state.query">
        <switches :switches="state.switches" :currentIndex="state.currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="state.currentIndex === 0" :data="state.playHistory">
            <div class="list-inner">
              <song-list :songs="state.playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" class="list-scroll" v-if="state.currentIndex === 1" :data="state.searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="state.searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="state.query">
        <suggest :query="state.query" @select="selectSuggest"></suggest>
      </div>
      <top-tip ref="topTips">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script setup>
import SearchBox from '@/base/search-box/search-box.vue'
import Scroll from '@/base/scroll/scroll.vue'
import SearchList from '@/base/search-list/search-list.vue'
import SongList from "@/base/song-list/song-list.vue"
import Suggest from '@/components/suggest/suggest.vue'
import Switches from '@/base/switches/switches'
import TopTip from '@/base/top-tip/top-tip'

import { reactive, getCurrentInstance, onMounted, computed, ref, watch } from 'vue';
const { proxy } = getCurrentInstance();
import { Toast } from 'vant';

import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
const storeActions = useStoreActions('storeState', ['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory', 'insertSong'])
const storeState = useStoreState('storeState', ['searchHistory'])
const storeGetters = useStoreGetters('storeState', ['playlist', 'playHistory'])


const songList = ref(null)
const searchList = ref(null)
const topTips = ref(null)

const state = reactive({
  query: '',
  showFlag: false,
  showSinger: false,
  currentIndex: 0,
  songs: [],
  switches: [
    {
      name: '最近播放'
    },
    {
      name: '搜索历史'
    }
  ],
  searchHistory: storeState.searchHistory,
  playHistory: computed(() => {
    return storeGetters.playHistory.value
  })
})

const addQuery = (item) => {
  state.query = item;
}

const deleteSearchHistory = (item) => {
  storeActions.deleteSearchHistory(item)
}

const show = () => {
  state.showFlag = true
  setTimeout(() => {
    if (state.currentIndex === 0) {
      songList.value.refresh()
    } else {
      searchList.value.refresh()
    }
  }, 20)
}

const hide = () => {
  state.showFlag = false
}

const selectSong = (song, index) => {
  if (index !== 0) {
    // storeActions.insertSong()
    topTips.value.show()
  }
}

const selectSuggest = () => {
  topTips.value.show()
  saveSearch()
}

const saveSearch = () => {
  storeActions.saveSearchHistory(state.query)
}

const switchItem = (index) => {
  state.currentIndex = index
}

const onQueryChange = (query) => {
  state.query = query.searchValue
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
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
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: 18px;
      color: #fff;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: #ffcd32;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
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
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: 14px;
      color: #ffcd32;
      margin-right: 4px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>