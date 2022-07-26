<template>
  <div
    class="recommend"
    ref="recommend"
  >
    <scroll
      class="recommend-content"
      ref="scroll"
    >
      <div>
        <van-swipe
          class="my-swipe"
          :autoplay="3000"
          :height="150"
          indicator-color="white"
          :stop-propagation="false"
        >
          <van-swipe-item
            v-for="(item, index) in state.recommends"
            :key="index"
          >
            <van-image
              width="100%"
              height="100%"
              :src="item.pic"
            />

          </van-swipe-item>
        </van-swipe>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              class="item"
              v-for="(item, index) in state.disclist"
              :key="index"
              @click="selectItem(item.id)"
            >
              <div class="icon">
                <img
                  width="60"
                  height="60"
                  :src="item.coverImgUrl"
                  alt=""
                >
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">
                  <span
                    class="tag"
                    v-for="(childItem, childIndex) in item.tags"
                    :key="childIndex"
                  >#{{childItem}}</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!state.recommends.length">
        <loading :dataStatus="'LOADING'"></loading>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition :appear="true" name="slide">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
const storeGetters = useStoreGetters('storeState', ['playlist'])

import Scroll from '@/base/scroll/scroll.vue'
import Loading from "@/base/loading/loading.vue"
import { reactive, getCurrentInstance, onMounted, computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const scroll = ref(null)
const recommend = ref(null)
const { proxy } = getCurrentInstance();
const state = reactive({
  recommends: [],
  disclist: [],
  playlist: computed(() => {
    return storeGetters.playlist.value
  })
});
const handlePlaylist = (playlist) => {
  const bottom = playlist.length > 0 ? '60px' : ''
  recommend.value.style.bottom = bottom
  scroll.value.refresh()
}
watch(() => state.playlist, (newVal) => {
  console.log(newVal)
  handlePlaylist(newVal);
})
const _getRecommend = async () => {
  const { data: res } = await proxy.$http.banner();
  if (res.code == 200) {
    state.recommends = res.banners;
  }
}
const getMusicList = async () => {
  const { data: res } = await proxy.$http.getMusicList();
  if (res.code == 200) {
    state.disclist = res.playlists;
  }
}
const selectItem = (id) => {
  router.push({
    path: `/recommend/${id}`,
  })
}
onMounted(() => {
  _getRecommend()
  getMusicList()
  handlePlaylist(state.playlist)
})
</script>

<style lang="scss" scoped>
.swiperImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
  }
  .recommend-list {
    .list-title {
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: 14px;
      color: #ffcd32;
    }
    .item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 0 20px 20px 20px;
      .icon {
        flex: 0 0 60px;
        width: 60px;
        padding-right: 20px;
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        font-size: 14px;
        .name {
          margin-bottom: 10px;
          color: #fff;
        }
        .desc {
          color: rgba(255, 255, 255, 0.3);
          .tag {
            color: #ff641e;
            padding-right: 5px;
          }
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>