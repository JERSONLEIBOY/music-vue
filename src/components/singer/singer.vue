<template>
  <div
    class="singer"
    ref="singer"
  >
    <list-view
      :dataList="state.singerList"
      :shortcut="state.shortcut"
      :dataStatus="state.dataStatus"
      :currentIndex="state.currentIndex"
      @pullingUp="handlePullingUp"
      @onShortcutTouchStart="selectType"
      @selectItem="handleSelectItem"
    ></list-view>
    <router-view v-slot="{ Component }">
      <transition :appear="true" name="slide">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import ListView from "@/base/listview/listview.vue";
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
const { proxy } = getCurrentInstance();
const router = useRouter();
const state = reactive({
  singerList: [],
  params: {
    type: -1,
    area: -1,
    initial: '',
    limit: 10,
    offset: 0
  },
  currentIndex: 0,
  shortcut: [{
    title: '热'
  }, {
    title: 'A'
  }, {
    title: 'B'
  }, {
    title: 'C'
  }, {
    title: 'D'
  }, {
    title: 'E'
  }, {
    title: 'F'
  }, {
    title: 'G'
  }, {
    title: 'H'
  }, {
    title: 'I'
  }, {
    title: 'J'
  }, {
    title: 'K'
  }, {
    title: 'L'
  }, {
    title: 'M'
  }, {
    title: 'N'
  }, {
    title: 'O'
  }, {
    title: 'P'
  }, {
    title: 'Q'
  }, {
    title: 'R'
  }, {
    title: 'S'
  }, {
    title: 'T'
  }, {
    title: 'U'
  }, {
    title: 'V'
  }, {
    title: 'W'
  }, {
    title: 'X'
  }, {
    title: 'Y'
  }, {
    title: 'Z'
  }, {
    title: '#'
  }],
  dataStatus: 'HAS_MORE_DATA',
  more: false
})
const topArtists = async (params) => {
  if (state.dataStatus == 'LOADING') return;
  state.dataStatus = 'LOADING';
  const { data: res } = await proxy.$http.artistList(params);
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.singerList = state.params.offset !== 0 ? [...state.singerList, ...res.artists] : res.artists;
  if (res.more) {
    state.dataStatus = 'HAS_MORE_DATA'
  } else {
    state.dataStatus = 'NO_MORE_DATA'
  }
  state.more = res.more;
}
const handlePullingUp = () => {
  if (!state.more) return;
  state.params.offset = state.singerList.length;
  topArtists(state.params).catch((error) => {
    console.log(error)
  })
}
const selectType = (item, index) => {
  state.currentIndex = index;
  state.singerList = [];
  state.params.offset = 0;
  if (item.title == '热') {
    state.params.initial = -1;
  } else if (item.title == '#') {
    state.params.initial = 0;
  } else {
    state.params.initial = item.title;
  }
  topArtists(state.params).catch((error) => {
    console.log(error)
  })
}
const handleSelectItem = (item) => {
  router.push({
    path: `/singer/${item.id}`
  })
}
onMounted(() => {
  topArtists(state.params).catch((error) => {
    console.log(error)
  })
})
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>