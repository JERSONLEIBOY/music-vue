<template>
  <div class="search-box">
    <van-icon
      class="icon-search"
      name="search"
    />
    <input
      type="text"
      :placeholder="props.placeholder"
      v-model="state.query"
      class="box"
      @keyup.enter="search"
    >
    <van-icon
      class="icon-dismiss"
      name="clear"
      v-show="state.query"
      @click="clear"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
const emit = defineEmits(['clear', 'search', 'input'])
const state = reactive({
  query: ''
})
const props = defineProps({
  placeholder: {
    type: String,
    default: "搜索歌曲、歌手"
  },
  query: {
    type: String,
    default: ''
  }
})
const clear = () => {
  state.query = ''
  emit('clear', {
    searchValue: state.query
  })
}
const search = () => {
  emit('search', {
    searchValue: state.query
  })
}
watch(() => state.query, (newQuery) => {
  // state.query = newQuery
  emit('input', {
    searchValue: state.query
  })
})
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: #333;
  border-radius: 6px;
  .icon-search {
    color: #222;
    font-size: 24px;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: #333;
    color: #fff;
    font-size: 14px;
  }
  .icon-dismiss {
    color: #222;
    font-size: 16px;
  }
}
</style>