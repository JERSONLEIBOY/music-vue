<template>
  <div
    class="rank"
    ref="rank"
  >
    <scroll
      class="toplist"
      ref="toplist"
    >
      <ul>
        <li class="item" v-for="(item, index) in state.topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <van-image
              width="100%"
              height="100%"
              lazy-load
              :src="item.coverImgUrl"
            />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.tracks" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.first}}--{{song.second}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!state.topList.length">
        <loading :dataStatus="'LOADING'"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();
import Scroll from '@/base/scroll/scroll.vue'
import Loading from "@/base/loading/loading.vue"
import { Toast } from 'vant';
const router = useRouter();
const state = reactive({
  topList: []
})
const toplist = async () => {
  const { data: res } = await proxy.$http.topListDetail();
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.topList = res.list.splice(0, 4)
}
const selectItem = (item) => {
  router.push({
    path: `/rank/${item.id}`,
  })
}
onMounted(() => {
  toplist();
})
</script>

<style lang="scss" scoped>
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: #333;
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
        .song {
          line-height: 26px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
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