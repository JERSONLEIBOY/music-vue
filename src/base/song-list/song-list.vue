<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(item, index) in props.songs"
        :key="index"
        @click="selectItem(item, index)"
      >
        <div
          class="rank"
          v-show="props.rank"
        >
          <span
            :class="getRankCls(index)"
            v-text="getRankTetx(index)"
          ></span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const emit = defineEmits(['select'])
const props = defineProps({
  songs: {
    type: Array,
    default: []
  },
  rank: {
    type: Boolean,
    default: false
  }
})
const getRankCls = (index) => {
  if (index <= 2) {
    return `icon icon${index}`
  } else {
    return 'text'
  }
}
const getRankTetx = (index) => {
  if (index > 2) {
    return index + 1
  }
}
const getDesc = (song) => {
  let name = [];
  song.singer.forEach(element => {
    name.push(element.name)
  });
  return `${name.join('/')}.${song.album.name}`;
}
const selectItem = (item, index) => {
  emit('select', item, index)
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: 14px;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          background-image: url("first@3x.png")
        }
        &.icon1 {
          background-image: url("second@3x.png")
        }
        &.icon2 {
          background-image: url("third@3x.png")
        }
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #fff;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 4px;
        color: rgba(255,255,255,0.3);
      }
    }
  }
}
</style>