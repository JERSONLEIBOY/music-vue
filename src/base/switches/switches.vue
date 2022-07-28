<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, index) in props.switches" :key="index" :class="{'active': props.currentIndex === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script setup>
const emit = defineEmits(['switch'])
const props = defineProps({
  switches: {
    type: Array,
    default: []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})
const switchItem = (index) => {
  emit('switch', index)
}
</script>

<style lang="scss" scoped>
.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid #333;
  border-radius: 5px;
  .switch-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    &.active {
      background: #333;
      color: #fff;
    }
  }
}
</style>