<template>
  <scroll
    class="listview"
    :probeType="1"
    :data="dataList"
    :listenScroll="true"
    :pullup="pullingUp"
  >
    <ul>
      <li
        class="list-group"
        ref="listgroup"
      >
        <ul>
          <li
            class="list-group-item"
            v-for="(item, index) in dataList"
            @click="selectItem(item)"
            :key="index"
          >
            <van-image
              width="50"
              height="50"
              lazy-load
              :round="true"
              :src="item.picUrl + '?param=120y120'"
            />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
        <loading :vertical="true" :dataStatus="dataStatus"></loading>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcut"
          :key="index"
          :class="{'current': props.currentIndex === index}"
          @click.stop="onShortcutTouchStart(item, index)"
        >{{item.title}}</li>
      </ul>
    </div>
    <div
      class="list-fixed"
      ref="fixed"
    >
      <div class="fixed-title">热门歌手</div>
    </div>
  </scroll>
</template>

<script setup>
import Scroll from '@/base/scroll/scroll.vue'
import Loading from "@/base/loading/loading.vue"
const emit = defineEmits(['pullingUp', 'onShortcutTouchStart', 'selectItem'])
const props = defineProps({
  dataList: {
    type: Array,
    default: []
  },
  shortcut: {
    type: Array,
    default: []
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  dataStatus: {
    type: String,
    default: 'HAS_MORE_DATA'
  }
})
const pullingUp = () => {
  emit("pullingUp")
}
const onShortcutTouchStart = (item, index) => {
  emit('onShortcutTouchStart', item, index)
}
const selectItem = (item) => {
  emit('selectItem', item)
}
</script>

<style lang="scss" scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #222;
  .list-group {
    padding: 30px 0;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      background: #333;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      &.current {
        color: #ffcd32;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      background: #333;
    }
  }
}
</style>