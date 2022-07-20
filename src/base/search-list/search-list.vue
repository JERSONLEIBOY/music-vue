<template>
  <div class="search-list" v-show="props.searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="(item, index) in props.searches" :key="index" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <van-icon class="icon-delete" name="delete" />
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
const emit = defineEmits(['select', 'delete'])
const props = defineProps({
  searches: {
    type: Array,
    default: []
  }
})
const selectItem = (item) => {
  emit('select', item)
}
const deleteOne = (item) => {
  emit('delete', item)
}
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    &.list-enter-active, &.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter, &.list-leave-to {
      height: 0;
    }
    .text {
      flex: 1;
      color: rgba($color: #fff, $alpha: .5);
    }
    .icon {
      position: relative;
      .icon-delete {
        font-size: 14px;
        color: rgba($color: #fff, $alpha: .3);
      }
    }
  }
}
</style>