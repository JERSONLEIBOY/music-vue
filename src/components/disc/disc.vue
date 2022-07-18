<template>
  <music-list :title="state.title" :bg-image="state.bgImage" :songs="state.songs"></music-list>
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
  title: "",
  bgImage: ""
})
const _getSongList = async (id, s) => {
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
  _getSongList(state.rId, 8)
})
</script>

<style lang="scss" scoped>

</style>