<template>
  <transition name="list-fade">
    <div class="playlist" v-show="state.showFlag" @click.stop="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="state.sequenceList">
          <transition-group ref="list" name="list" tag="ul">
            <li class="item" v-for="(item, index) in state.sequenceList" :key="index" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="handleAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script setup>
import Scroll from '@/base/scroll/scroll.vue'
import Confirm from '@/base/confirm/confirm.vue'
import AddSong from '@/components/add-song/add-song.vue'
import { playMode } from '@/utils/config'


import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
const storeGetters = useStoreGetters('storeState', ['playlist', 'currentIndex', 'fullScreen', 'playing', 'currentSong', 'mode', 'favoriteList', 'sequenceList'])
const storeActions = useStoreActions('storeState', ['deleteSongList', 'deleteSong', 'setFullScreen', 'setPlayingState', 'setPlayMode', 'setPlaylist', 'setCurrentIndex', 'saveFavoriteList', 'deleteFavoriteList', 'setPlayingState'])

import { reactive, getCurrentInstance, onMounted, computed, ref, watch, nextTick } from 'vue';

const { proxy } = getCurrentInstance();
const listContent = ref(null)
const list = ref(null)
const confirm = ref(null)
const addSong = ref(null)

const state = reactive({
  showFlag: false,
  mode: computed(() => {
    return storeGetters.mode.value
  }),
  currentSong: computed(() => {
    return storeGetters.currentSong.value
  }),
  playlist: computed(() => {
    return storeGetters.playlist.value
  }),
  sequenceList: computed(() => {
    return storeGetters.sequenceList.value
  })
})

const iconMode = computed(() => {
  return state.mode === playMode.sequence ? 'icon-sequence' : state.mode === playMode.loop ? 'icon-loop' : 'icon-random'
})
const modeText = computed(() => {
  return state.mode === playMode.sequence ? '顺序播放' : state.mode === playMode.random ? '随机播放' : '单曲循环'
})

const show = () => {
  state.showFlag = true
  setTimeout(() => {
    listContent.value.refresh()
    scrollToCurrent(state.currentSong)
  })
}
defineExpose({
  show
})

const handleAddSong = () => {
  addSong.value.show()
}

const hide = () => {
  state.showFlag = false
}

const showConfirm = () => {
  confirm.value.show()
}

const confirmClear = () => {
  storeActions.deleteSongList()
  hide()
}

const deleteOne = (item) => {
  storeActions.deleteSong(item)
  if (!state.playlist.length) {
    hide()
  }
}

const getCurrentIcon = (item) => {
  if (state.currentSong.id === item.id) {
    return 'icon-play'
  }
  return ''
}

const changeMode = () => {
  const mode = (state.mode + 1) % 3
  storeActions.setPlayMode(mode)
  let list = null
  if (mode === playMode.random) {
    list = proxy.$utils.shuffle(storeGetters.sequenceList.value)
  } else {
    list = storeGetters.sequenceList.value
  }
  resetCurrentIndex(list)
  storeActions.setPlaylist(list)
}

const selectItem = (item, index) => {
  if (state.mode === playMode.random) {
    index = state.playlist.findIndex((song) => {
      return song.id === item.id
    })
  }
  storeActions.setCurrentIndex(index)
  storeActions.setPlayingState(true)
}

const scrollToCurrent = (current) => {
  const index = storeGetters.sequenceList.value.findIndex((song) => {
    return current.id === song.id
  })
  listContent.value.scrollToElement(list.value.$el.children[index], 300)
}

const getFavoriteIcon = (song) => {
  if (isFavorite(song)) {
    return 'icon-favorite'
  }
  return 'icon-not-favorite'
}
const isFavorite = (song) => {
  const index = storeGetters.favoriteList.value.findIndex((item) => {
    return item.id === song.id
  })
  return index > -1
}

const toggleFavorite = (song) => {
  if (isFavorite(song)) {
    storeActions.deleteFavoriteList(song)
  } else {
    storeActions.saveFavoriteList(song)
  }
}

watch(() => state.currentSong, (newSong, oldSong) => {
  if (!state.showFlag || newSong.id === oldSong.id) {
    return
  }
  setTimeout(() => {
    scrollToCurrent(newSong)
  }, 20)
})
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0,0,0,0.3);
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  &.list-fade-enter-to {
    opacity: 1;
    .list-wrapper {
      transform: translate3d(0, 0, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #333;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: rgba(255,205,49,0.5);
        }
        .text {
          flex: 1;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }
        .clear {
          position: relative;
          &:before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
          }
          .icon-clear {
            font-size: 14px;
            color: rgba(255,255,255,0.3);
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: 12px;
          color: rgba(255,205,49,0.5);
        }
        .text {
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
          color: rgba(255,255,255,0.3);
        }
        .like {
          position: relative;
          margin-right: 15px;
          font-size: 12px;
          color: #ffcd32;
          &:before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
          }
        }
        .delete {
          position: relative;
          font-size: 12px;
          color: #ffcd32;
          &:before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
          }
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid rgba(255,255,255,0.5);
        border-radius: 100px;
        color: rgba(255,255,255,0.5);
        .icon-add {
          margin-right: 5px;
          font-size: 10px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: #222;
      font-size: 16px;
      color: rgba(255,255,255,0.5);
    }
  }
}
</style>