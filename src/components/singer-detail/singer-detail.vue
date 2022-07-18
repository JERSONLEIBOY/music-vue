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
  songs: [],
  title: "",
  bgImage: "",
})
const _getDetail = async (id) => {
  const { data: res } = await proxy.$http.artists({id: id});
  if (res.code !== 200) {
    return Toast.fail('数据请求失败')
  }
  state.title = res.artist.name;
  state.bgImage = res.artist.picUrl + `?param=300y300`;
  state.songs = proxy.$utils.formatSongs(res.hotSongs)
}
onMounted(() => {
  state.rId = route.params.id;
  _getDetail(state.rId)
})
</script>

<style lang="scss" scoped>

</style>