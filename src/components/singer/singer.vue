<template>
  <div
    class="singer"
    ref="singer"
  >
    <list-view
      :dataList="state.singerList"
      :shortcut="state.shortcut"
      :isLoading="state.isLoading"
      @pullingUp="handlePullingUp"
    ></list-view>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import ListView from "@/base/listview/listview.vue";
import { Toast } from 'vant';
const { proxy } = getCurrentInstance();
const state = reactive({
  singerList: [],
  params: {
    type: -1,
    area: -1,
    initial: '',
    limit: 10,
    offset: 0
  },
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
  isLoading: false,
  more: false
})
const topArtists = async (params) => {
  state.isLoading = true;
  const { data: res } = await proxy.$http.artistList(params);
  if (res.code !== 200) {
    state.isLoading = false;
    return Toast.fail('数据请求失败')
  }
  state.isLoading = false;
  state.singerList = state.params.offset !== 0 ? [...state.singerList, ...res.artists] : res.artists;
  state.more = res.more;
}
const handlePullingUp = () => {
  if (!state.more) return;
  state.params.offset = state.singerList.length;
  topArtists(state.params)
}
onMounted(() => {
  topArtists(state.params)
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