<template>
  <transition name="drop">
    <div class="top-tip" v-show="state.showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script setup>
import { reactive } from 'vue';
let timer = null
const props = defineProps({
  delay: {
    type: Number,
    default: 2000
  }
})
const state = reactive({
  showFlag: false
})

const show = () => {
  state.showFlag = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    hide()
  }, props.delay)
}
const hide = () => {
  state.showFlag = false
}
defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.top-tip {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
  background: #666;
  &.drop-enter-active, &.drop-leave-active {
    transition: all 0.3s;
  }
  &.drop-enter, &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>