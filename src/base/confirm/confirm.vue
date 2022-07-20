<template>
  <transition name="confirm-fade">
    <div
      class="confirm"
      v-show="state.showFlag"
    >
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{props.text}}</p>
          <div class="operate">
            <div
              @click="cancel"
              class="operate-btn left"
            >{{props.cancelBtnText}}</div>
            <div
              @click="confirm"
              class="operate-btn"
            >{{props.confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive } from "@vue/reactivity"

const emit = defineEmits(['cancel', 'confirm'])
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  confirmBtnText: {
    type: String,
    default: '确定'
  },
  cancelBtnText: {
    type: String,
    default: '取消'
  }
})
const state = reactive({
  showFlag: false
})
const show = () => {
  state.showFlag = true;
}
const hide = () => {
  state.showFlag = false;
}
defineExpose({
  show,
  hide
})
const cancel = () => {
  hide();
  emit('cancel')
}
const confirm = () => {
  hide();
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: rgba($color: #000000, $alpha: .3);
  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;
    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }
  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: #333;
      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: 18px;
        color: rgba($color: #fff, $alpha: .5);
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 18px;
        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid rgba($color: #000000, $alpha: .3);
          color: rgba($color: #fff, $alpha: .3);
          &.left {
            border-right: 1px solid rgba($color: #000000, $alpha: .3);
          }
        }
      }
    }
  }
}
@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>