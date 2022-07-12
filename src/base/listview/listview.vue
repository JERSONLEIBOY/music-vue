<template>
  <scroll class="listview" :probeType="3">
    <ul>
      <li
        v-for="(item, index) in dataList"
        :key="index"
        class="list-group"
        ref="listgroup"
      >
        <h2 class="list-group-title">1111</h2>
        <ul>
          <li class="list-group-item">
            <img
              class="avatar"
              :src="item.picUrl"
              alt=""
            >
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li class="item" v-for="(item, index) in shortcut" :key="index"></li>
      </ul>
    </div>
    <div
      class="list-fixed"
      ref="fixed"
    >
      <div class="fixed-title">1</div>
    </div>
  </scroll>
</template>

<script setup>
import Scroll from '@/base/scroll/scroll.vue'
import { reactive, onMounted } from 'vue';
const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;
const state = reactive({
  currentIndex: 0,
  scrollY: -1,
  diff: -1
})
const props = defineProps({
  dataList: {
    type: Array,
    default: []
  },
  shortcut: {
    type: Array,
    default: []
  }
})
</script>

<style lang="scss" scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #222;
  .list-group {
    padding-bottom: 30px;
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