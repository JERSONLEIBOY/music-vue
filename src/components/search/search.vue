<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchbox" :query="state.query" @input="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item, index) in state.hotKey" :key="index" @click="addQuery(item)">
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <van-icon class="icon-clear" name="close" />
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result">

    </div>
  </div>
</template>

<script setup>
import SearchBox from '@/base/search-box/search-box.vue'
import { reactive, getCurrentInstance, onMounted } from 'vue';
const { proxy } = getCurrentInstance();
import { Toast } from 'vant';

const state = reactive({
  query: '',
  hotKey: []
})
const onQueryChange = (query) => {
  state.query = query.searchValue
}
const _getHotKey = async () => {
  const { data: res } = await proxy.$http.serachHot();
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.hotKey = res.result.hots;
}
onMounted(() => {
  _getHotKey()
})
</script>

<style lang="scss" scoped>
.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: 14px;
          color: rgba($color: #fff, $alpha: .5);
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: #333;
          font-size: 14px;
          color: rgba($color: #fff, $alpha: .3);
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: 14px;
          color: rgba($color: #fff, $alpha: .5);
          .text {
            flex: 1;
          }
          .clear {
            position: relative;
            .icon-clear {
              font-size: 14px;
              color: rgba($color: #fff, $alpha: .5);
            }
          }
        }
      }
    }
  }
}
</style>