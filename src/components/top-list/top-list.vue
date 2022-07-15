<template>
  <music-list></music-list>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import MusicList from '@/components/music-list/music-list.vue'
const route = useRoute();
const state = reactive({
  rId: 0
})
onMounted(() => {
  state.rId = route.params.id;
  console.log(route.params.id)
})
</script>

<style lang="scss" scoped>
</style>