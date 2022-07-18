<template>
  <div
    class="recommend"
    ref="recommend"
  >
    <scroll
      class="recommend-content"
    >
      <div>
        <van-swipe
          class="my-swipe"
          :autoplay="3000"
          :height="150"
          indicator-color="white"
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
              @click="selectItem(item)"
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
    </scroll>
    <router-view v-slot="{ Component }">
      <transition :appear="true" name="slide">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Scroll from '@/base/scroll/scroll.vue'
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const { proxy } = getCurrentInstance();
const state = reactive({
  recommends: [],
  disclist: []
});
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
const selectItem = (item) => {
  router.push({
    path: `/recommend/${item.id}`,
  })
}
onMounted(() => {
  _getRecommend()
  getMusicList()
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
  }
}
</style>