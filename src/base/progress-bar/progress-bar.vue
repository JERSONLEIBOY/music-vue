<template>
  <div
    class="progress-bar"
    ref="progressBar"
    @click="progressClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
      ></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { prefixStyle } from '@/utils/dom'

const emit = defineEmits(['percentChange'])

const progressBtnWidth = 16
const transform = prefixStyle('transform')

const progress = ref(null)
const progressBar = ref(null)
const progressBtn = ref(null)

const props = defineProps({
  percent: {
    type: Number,
    default: 0
  }
})
const state = reactive({
  touch: {}
})

watch(() => props.percent, (newPercent) => {
  if (newPercent >= 0 && !state.touch.initiated) {
    const barWidth = progressBar.value.clientWidth - progressBtnWidth
    const offsetWidth = newPercent * barWidth
    _offset(offsetWidth)
  }
})

const progressTouchStart = (e) => {
  state.touch.initiated = true
  state.touch.startX = e.touches[0].pageX
  state.touch.left = progress.value.clientWidth
}

const progressTouchMove = (e) => {
  if (!state.touch.initiated) {
    return
  }
  const deltaX = e.touches[0].pageX - state.touch.startX
  const offsetWidth = Math.min(progressBar.value.clientWidth - progressBtnWidth, Math.max(0, state.touch.left + deltaX))
  _offset(offsetWidth)
}

const progressTouchEnd = () => {
  state.touch.initiated = false
  _triggerPercent()
}

const _triggerPercent = () => {
  const barWidth = progressBar.value.clientWidth - progressBtnWidth
  const percent = progress.value.clientWidth / barWidth
  emit('percentChange', percent)
}

const _offset = (offsetWidth) => {
  progress.value.style.width = `${offsetWidth}px`
  progressBtn.value.style[transform] = `translate3d(${offsetWidth}px,0,0)`
}
const progressClick = (e) => {
  const rect = progressBar.value.getBoundingClientRect()
  const offsetWidth = e.pageX - rect.left
  _offset(offsetWidth)
  // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
  // this._offset(e.offsetX)
  _triggerPercent()
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: #ffcd32;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: #ffcd32;
      }
    }
  }
}
</style>