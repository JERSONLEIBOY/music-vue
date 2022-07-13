<template>
  <div class="singer" ref="singer">
    <list-view :dataList="state.singerList" :shortcut="state.shortcut"></list-view>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import ListView from "@/base/listview/listview.vue";
const HOT_SINGER_LEN = 100;
const HOT_NAME = "热门";
const { proxy } = getCurrentInstance();
const state = reactive({
  singerList: [],
  params: {
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
  }]
})
const topArtists = async (params) => {
  const { data: res } = await proxy.$http.topArtists(params);
  if (res.code == 200) {
    state.singerList = res.artists;
  }
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