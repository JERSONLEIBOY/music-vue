<template>
  <div
    class="player"
    v-show="state.playlist.length > 0"
  >
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div
        class="normal-player"
        v-show="state.fullScreen"
        ref="normalPlayer"
      >
        <div class="background">
          <img
            width="100%"
            height="100%"
            :src="state.currentSong && state.currentSong.album && state.currentSong.album.picUrl"
            alt=""
          >
        </div>
        <div class="top">
          <div
            class="back"
            @click="back"
          >
            <i class="icon-back"></i>
          </div>
          <h1
            class="title"
            v-html="state.currentSong.name"
          ></h1>
          <h2 class="subtitle">{{getDesc(state.currentSong)}}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div
            class="middle-l"
            ref="middleL"
          >
            <div
              class="cd-wrapper"
              ref="cdWrapper"
            >
              <div
                class="cd"
                :class="cdCls"
              >
                <img
                  class="image"
                  :src="state.currentSong && state.currentSong.album && state.currentSong.album.picUrl"
                  alt=""
                >
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{state.playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            :probeType="3"
            ref="lyricList"
            :refreshScroll="true"
            :data="state.currentLyric && state.currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="state.currentLyric">
                <p
                  class="text"
                  ref="lyricLine"
                  :class="{'current': state.currentLineNum === index}"
                  v-for="(item, index) in state.currentLyric.lines"
                  :key="index"
                >{{item.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              :class="{'active': state.currentShow === 'cd'}"
            ></span>
            <span
              class="dot"
              :class="{'active': state.currentShow === 'lyric'}"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(state.currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{state.currentSong.duration}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div
              class="icon i-left"
              :class="disableCls"
            >
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div
              class="icon i-center"
              :class="disableCls"
            >
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div
              class="icon i-right"
              :class="disableCls"
            >
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                class="icon"
                :class="getFavoriteIcon(state.currentSong)"
                @click="toggleFavorite(state.currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div
        class="mini-player"
        v-show="!state.fullScreen"
        @click="open"
      >
        <div class="icon">
          <img
            :class="cdCls"
            width="40"
            height="40"
            :src="state.currentSong && state.currentSong.album && state.currentSong.album.picUrl"
            alt=""
          >
        </div>
        <div class="text">
          <h2
            class="name"
            v-html="state.currentSong.name"
          ></h2>
          <p class="desc">{{getDesc(state.currentSong)}}</p>
        </div>
        <div class="control">
          <progress-circle
            :radius="state.radius"
            :percent="percent"
          >
            <i
              @click.stop="togglePlaying"
              class="icon-mini"
              :class="miniIcon"
            ></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="state.currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script setup>
import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
import animations from 'create-keyframe-animation'
import Scroll from '@/base/scroll/scroll.vue'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import ProgressBar from '@/base/progress-bar/progress-bar'
import { prefixStyle } from '@/utils/dom'
import { playMode } from '@/utils/config'
import Lyric from 'lyric-parser'
import { reactive, getCurrentInstance, onMounted, computed, ref, watch, nextTick } from 'vue';
import { Toast } from 'vant';
const { proxy } = getCurrentInstance();
const storeActions = useStoreActions('storeState', ['setFullScreen', 'setPlayingState', 'setPlayMode', 'setPlaylist', 'setCurrentIndex', 'saveFavoriteList', 'deleteFavoriteList'])
const storeGetters = useStoreGetters('storeState', ['playlist', 'currentIndex', 'fullScreen', 'playing', 'currentSong', 'mode', 'favoriteList', 'sequenceList'])
const cdWrapper = ref(null)
const lyricList = ref(null)
const middleL = ref(null)
const audio = ref(null)
const lyricLine = ref(null)
const wrapper = ref(null)
console.log(audio)
const state = reactive({
  playlist: computed(() => {
    return storeGetters.playlist.value
  }),
  currentIndex: computed(() => {
    return storeGetters.currentIndex.value
  }),
  fullScreen: computed(() => {
    return storeGetters.fullScreen.value
  }),
  playing: computed(() => {
    return storeGetters.playing.value
  }),
  currentSong: computed(() => {
    return storeGetters.currentSong.value
  }),
  mode: computed(() => {
    return storeGetters.mode.value
  }),
  touch: {},
  songReady: false,
  currentTime: 0,
  radius: 32,
  currentLyric: null,
  currentLineNum: 0,
  currentShow: 'cd',
  playingLyric: ''
})
const iconMode = computed(() => {
  return state.mode === playMode.sequence ? 'icon-sequence' : state.mode === playMode.loop ? 'icon-loop' : 'icon-random'
})
const cdCls = computed(() => {
  return state.playing ? 'play' : 'play pause'
})
const playIcon = computed(() => {
  return state.playing ? 'icon-pause' : 'icon-play'
})
const miniIcon = computed(() => {
  return state.playing ? 'icon-pause-mini' : 'icon-play-mini'
})
const disableCls = computed(() => {
  return state.songReady ? '' : 'disable'
})
const percent = computed(() => {
  if (Object.keys(state.currentSong).length != 0) {
    return state.currentTime / proxy.$utils.formatSongSecond(state.currentSong.duration)
  }
})
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
const resetCurrentIndex = (list) => {
  let index = list.findIndex((item) => {
    return item.id === state.currentSong.id
  })
  storeActions.setCurrentIndex(index)
}
const togglePlaying = () => {
  if (!state.songReady) return
  storeActions.setPlayingState(!state.playing)
  if (state.currentLyric) {
    state.currentLyric.togglePlay()
  }
}
const enter = (el, done) => {
  const { x, y, scale } = _getPosAndScale()
  let animation = {
    0: {
      transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
    },
    60: {
      transform: `translate3d(0,0,0) scale(1.1)`
    },
    100: {
      transform: `translate3d(0,0,0) scale(1)`
    }
  }
  animations.registerAnimation({
    name: 'move',
    animation,
    presets: {
      duration: 400,
      easing: 'linear'
    }
  })
  animations.runAnimation(cdWrapper.value, 'move', done)
}
const afterEnter = () => {
  animations.unregisterAnimation('move')
  cdWrapper.value.style.animation = ''
}
const leave = (el, done) => {
  cdWrapper.value.style.transition = 'all 0.4s'
  const { x, y, scale } = _getPosAndScale()
  cdWrapper.value.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
  cdWrapper.value.addEventListener('transitionend', done)
}
const afterLeave = () => {
  cdWrapper.value.style.transition = ''
  cdWrapper.value.style.transform = ''
}
const middleTouchStart = (e) => {
  state.touch.initiated = true
  // 用来判断是否是一次移动
  state.touch.moved = false
  const touch = e.touches[0]
  state.touch.startX = touch.pageX
  state.touch.startY = touch.pageY
}
const middleTouchMove = (e) => {
  if (!state.touch.initiated) {
    return
  }
  const touch = e.touches[0]
  const deltaX = touch.pageX - state.touch.startX
  const deltaY = touch.pageY - state.touch.startY
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    return
  }
  if (!state.touch.moved) {
    state.touch.moved = true
  }
  const left = state.currentShow === 'cd' ? 0 : -window.innerWidth
  const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
  state.touch.percent = Math.abs(offsetWidth / window.innerWidth)
  lyricList.value.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
  lyricList.value.$el.style.transitionDuration = 0
  middleL.value.style.opacity = 1 - state.touch.percent
  middleL.value.style.transitionDuration = 0
}
const middleTouchEnd = (e) => {
  if (!state.touch.moved) {
    return
  }
  let offsetWidth
  let opacity
  if (state.currentShow === 'cd') {
    if (state.touch.percent > 0.1) {
      offsetWidth = -window.innerWidth
      opacity = 0
      state.currentShow = 'lyric'
    } else {
      offsetWidth = 0
      opacity = 1
    }
  } else {
    if (state.touch.percent < 0.9) {
      offsetWidth = 0
      state.currentShow = 'cd'
      opacity = 1
    } else {
      offsetWidth = -window.innerWidth
      opacity = 0
    }
  }
  const time = 300
  lyricList.value.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
  lyricList.value.$el.style.transitionDuration = `${time}ms`
  middleL.value.style.opacity = opacity
  middleL.value.style.transitionDuration = `${time}ms`
  state.touch.initiated = false
}
const _getPosAndScale = () => {
  const targetWidth = 40
  const paddingLeft = 40
  const paddingBottom = 30
  const paddingTop = 80
  const width = window.innerWidth * 0.8
  const scale = targetWidth / width
  const x = -(window.innerWidth / 2 - paddingLeft)
  const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
  return {
    x,
    y,
    scale
  }
}
const back = () => {
  storeActions.setFullScreen(false)
}
const getDesc = (song) => {
  if (Object.keys(song).length === 0) return
  let name = [];
  song.singer.forEach(element => {
    name.push(element.name)
  });
  return `${name.join('/')}.${song.album.name}`;
}
const getLyric = async (id) => {
  const { data: res } = await proxy.$http.lyrics({ id: id })
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.currentLyric = new Lyric(res.lrc.lyric, handleLyric)
  if (state.playing) {
    state.currentLyric.play()
  }
}
const handleLyric = ({ lineNum, txt }) => {
  state.currentLineNum = lineNum;
  if (lineNum > 5) {
    let lineEl = lyricLine.value[lineNum - 5]
    lyricList.value.scrollToElement(lineEl, 1000)
  } else {
    lyricList.value.scrollTo(0, 0, 1000)
  }
  state.playingLyric = txt
}
const format = (interval) => {
  interval = interval | 0
  const minute = interval / 60 | 0
  const second = _pad(interval % 60)
  return `${minute}:${second}`
}
const _pad = (num, n = 2) => {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}
const toggleFavorite = (song) => {
  if (isFavorite(song)) {
    storeActions.deleteFavoriteList(song)
  } else {
    storeActions.saveFavoriteList(song)
  }
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
const prev = () => {
  if (!state.songReady) return
  if (state.playlist.length === 1) {
    loop()
    return
  } else {
    let index = state.currentIndex - 1;
    if (index === -1) {
      index = state.playlist.length - 1
    }
    storeActions.setCurrentIndex(index)
    if (!state.playing) {
      togglePlaying()
    }
  }
  state.songReady = true;
}
const ready = () => {
  state.songReady = true;
}
const error = () => {
  state.songReady = true;
}
const updateTime = (e) => {
  state.currentTime = e.target.currentTime
}
const end = () => {
  if (state.mode == playMode.loop) {
    loop()
  } else {
    next()
  }
}
const onProgressBarChange = (percent) => {
  const currentTime = proxy.$utils.formatSongSecond(state.currentSong.duration) * percent
  audio.value.currentTime = currentTime
  if (!state.playing) {
    togglePlaying()
  }
  if (state.currentLyric) {
    state.currentLyric.seek(currentTime * 1000)
  }
}
const loop = () => {
  audio.value.currentTime = 0
  audio.value.play()
  storeActions.setPlayingState(true)
  if (state.currentLyric) {
    state.currentLyric.seek(0)
  }
}
const next = () => {
  if (!state.songReady) return
  if (state.playlist.length === 1) {
    loop()
    return
  } else {
    let index = state.currentIndex + 1
    if (index === state.playlist.length) {
      index = 0
    }
    storeActions.setCurrentIndex(index)
    if (!state.playing) {
      togglePlaying()
    }
  }
  state.songReady = false
}
const open = () => {
  storeActions.setFullScreen(true)
}
watch(() => state.fullScreen, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      lyricList.value.refresh()
    }, 20)
  }
})
watch(() => state.playing, (newPlaying) => {
  nextTick(() => {
    newPlaying ? audio.value.play() : audio.value.pause()
  })
})
watch(() => state.currentSong, (newSong, oldSong) => {
  console.log(newSong, oldSong)
  if (!newSong.id) {
    return
  }
  if (newSong.id === oldSong.id) {
    return
  }
  if (state.currentLyric) {
    state.currentLyric.stop()
    state.currentTime = 0
    state.playingLyric = ''
    state.currentLineNum = 0
  }
  let timer = null;
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (newSong.vip) {
      Toast('开通VIP可免费播放');
      next();
    } else {
      audio.value.play()
      getLyric(newSong.id)
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: 22px;
          color: rgba(255, 205, 49, 0.5);
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 18px;
        color: #fff;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: rgba($color: #fff, $alpha: 0.5);
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            &.current {
              color: #fff;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          &.active {
            width: 20px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.8);
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: #fff;
          font-size: 12px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: #ffcd32;
          i {
            font-size: 30px;
          }
          &.i-left {
            text-align: right;
          }
          &.i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          &.i-right {
            text-align: left;
          }
        }
        .icon-favorite {
          color: #d93f30;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
    &.normal-enter-to {
      opacity: 1;
      .top {
        transform: translate3d(0, 0, 0);
      }
      .bottom {
        transform: translate3d(0, 0, 0);
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      -ms-flex: 1;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        color: #fff;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 30px;
        color: rgba(255, 205, 49, 0.5);
      }
      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>