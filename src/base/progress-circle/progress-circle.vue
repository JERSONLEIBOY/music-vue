<template>
  <div class="progress-circle">
    <svg
      :width="props.radius"
      :height="props.radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="state.dashArray"
        :stroke-dashoffset="state.dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, computed, ref, watch } from 'vue';
const props = defineProps({
  radius: {
    type: Number,
    default: 100
  },
  percent: {
    type: Number,
    default: 0
  }
})
console.log(props.percent)
const state = reactive({
  dashArray: Math.PI * 100,
  dashOffset: computed(() => {
    return (1 - props.percent) * state.dashArray
  })
})
</script>

<style lang="scss" scoped>
.progress-circle {
  position: relative;
  width: 32px;
  height: 32px;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: rgba(255,205,49,0.5);
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: #ffcd32;
    }
  }
}
</style>