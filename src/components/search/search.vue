<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchbox" :query="state.query" @input="onQueryChange" @clear="handleClickClear"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!state.query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="state.shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item, index) in state.hotKey" :key="index" @click="addQuery(item.first)">
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="state.searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <van-icon class="icon-clear" name="close" />
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="state.searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="state.query" ref="searchResult">
      <suggest ref="suggest" :query="state.query" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
  </div>
</template>

<script setup>
import { useStoreState, useStoreActions, useStoreGetters } from '@/utils/storeState'
import Scroll from '@/base/scroll/scroll.vue'
import SearchBox from '@/base/search-box/search-box.vue'
import SearchList from '@/base/search-list/search-list.vue'
import Suggest from '@/components/suggest/suggest.vue'
import Confirm from '@/base/confirm/confirm.vue'
import { reactive, getCurrentInstance, onMounted, computed, ref, watch } from 'vue';
const { proxy } = getCurrentInstance();
import { Toast } from 'vant';
const storeActions = useStoreActions('storeState', ['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'])
const storeState = useStoreState('storeState', ['searchHistory'])
const storeGetters = useStoreGetters('storeState', ['playlist'])
const confirm = ref(null)
const searchResult = ref(null)
const suggest = ref(null)
const shortcutWrapper = ref(null)
const shortcut = ref(null)

const state = reactive({
  query: '',
  hotKey: [],
  searchHistory: storeState.searchHistory,
  shortcut: computed(() => {
    return state.hotKey.concat(state.searchHistory)
  }),
  playlist: computed(() => {
    return storeGetters.playlist.value
  })
})
const handlePlaylist = (playlist) => {
  const bottom = playlist.length > 0 ? '60px' : ''
  searchResult.value.style.bottom = bottom
  suggest.value.refresh()

  shortcutWrapper.value.style.bottom = bottom
  shortcut.value.refresh()
}
watch(() => state.query, (newQuery) => {
  if (!newQuery) {
    setTimeout(() => {
      shortcut.value.refresh()
    }, 20)
  }
})
watch(() => state.playlist, (newVal) => {
  console.log(newVal)
  handlePlaylist(newVal);
})
const onQueryChange = (query) => {
  state.query = query.searchValue
}
const handleClickClear = (query) => {
  state.query = ''
}
const addQuery = (item) => {
  state.query = item;
}
const _getHotKey = async () => {
  const { data: res } = await proxy.$http.serachHot();
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.hotKey = res.result.hots;
}
const saveSearch = (item) => {
  storeActions.saveSearchHistory(state.query)
}
const deleteSearchHistory = (item) => {
  storeActions.deleteSearchHistory(item)
}
const showConfirm = () => {
  confirm.value.show()
}
const clearSearchHistory = () => {
  storeActions.clearSearchHistory()
}
onMounted(() => {
  _getHotKey()
  handlePlaylist(state.playlist);
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
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>