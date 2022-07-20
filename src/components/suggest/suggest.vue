<template>
  <scroll
    ref="suggest"
    class="suggest"
    :data="state.result"
    :listenScroll="true"
    :refreshScroll="true"
    :probeType="1"
    :pullup="handlePullingUp"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in state.result"
        :key="index"
      >
        <div class="icon">
          <van-icon
            class="icon-music"
            name="music-o"
          />
        </div>
        <div class="name">
          <p class="text">{{item.name}}--{{getDesc(item)}}</p>
        </div>
      </li>
      <loading
        :dataStatus="state.dataStatus"
      ></loading>
    </ul>
    <div
      class="no-result-wrapper"
      v-show="!state.hasMore && !state.result.length"
    >
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script setup>
import Scroll from '@/base/scroll/scroll.vue'
import Loading from "@/base/loading/loading.vue"
import NoResult from '@/base/no-result/no-result.vue'
import { reactive, getCurrentInstance, watch, nextTick } from 'vue';
const { proxy } = getCurrentInstance();
import { Toast } from 'vant';
import BScroll from '@better-scroll/core';
const limit = 20
const emit = defineEmits(['select'])
const props = defineProps({
  query: {
    type: String,
    default: ''
  }
})
const state = reactive({
  result: [],
  hasMore: false,
  offset: 0,
  dataStatus: 'HAS_MORE_DATA'
})
watch(() => [props.query], ([newQuery]) => {
  if (newQuery) {
    search(newQuery);
  } else {
    state.hasMore = false;
    state.result = [];
    state.offset = 0;
    state.dataStatus = 'HAS_MORE_DATA'
  }
})
const getDesc = (songs) => {
  let name = [];
  songs.ar.forEach(element => {
    name.push(element.name)
  });
  return `${name.join('/')}`
}
const search = async (newQuery) => {
  if (state.dataStatus == 'LOADING') return;
  state.dataStatus = 'LOADING';
  const { data: res } = await proxy.$http.cloudsearch({ keywords: newQuery, limit: limit, offset: state.offset });
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  let songs = res.result.songs || [];
  state.result = state.offset !== 0 ? [...state.result, ...songs] : songs;
  if (!songs.length || state.offset >= res.result.songCount) {
    state.hasMore = false;
    state.dataStatus = 'NO_MORE_DATA'
  } else {
    state.hasMore = true;
    state.dataStatus = 'HAS_MORE_DATA'
  }
}
const handlePullingUp = () => {
  if (!state.hasMore) return;
  state.offset = state.result.length;
  search(props.query)
}
const selectItem = (item) => {
  emit('select', item)
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding:10px 0;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      .icon-music {
        font-size: 14px;
        color: rgba($color: #fff, $alpha: 0.3);
      }
    }
    .name {
      flex: 1;
      font-size: 14px;
      color: rgba($color: #fff, $alpha: 0.3);
      overflow: hidden;
      .text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
  }
}
</style>