<template>
  <transition name="slide">
    <music-list :rank="state.rank" :title="state.title" :bg-image="state.bgImage" :songs="state.songs"></music-list>
  </transition>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
const { proxy } = getCurrentInstance();
import { Toast } from 'vant';
import MusicList from '@/components/music-list/music-list.vue'
const route = useRoute();
const state = reactive({
  rId: 0,
  songs: [],
  title: "",
  bgImage: "",
  rank: true
})
const _getMusicList = async (id, s) => {
  const { data: res } = await proxy.$http.listDetail({id: id, s: s});
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.title = res.playlist.name;
  state.bgImage = res.playlist.coverImgUrl;
  state.songs = proxy.$utils.formatSongs(res.playlist.tracks, res.privileges)
}
onMounted(() => {
  state.rId = route.params.id;
  _getMusicList(state.rId, -1)
})
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.slide-leave-from, .slide-enter-to {
  transform: translate3d(0, 0, 0);
}
</style>