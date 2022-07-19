<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{props.title}}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.no-result {
  text-align: center;
  .no-result-icon {
    width: 86px;
    height: 90px;
    margin: 0 auto;
    background-image: url("no-result@3x.png");
    background-size: 86px 90px;
  }
  .no-result-text {
    margin-top: 30px;
    font-size: 14px;
    color: rgba($color: #fff, $alpha: .3);
  }
}
</style>