<template>
  <div class="tab">
    <router-link
      to="/recommend"
      v-slot="{ href,route,isActive,navigate,isExactActive}"
      replace
      class="tab-item"
    >
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link
      to="/singer"
      v-slot="{ href,route,isActive,navigate,isExactActive}"
      replace
      class="tab-item"
    >
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link
      to="/rank"
      v-slot="{ href,route,isActive,navigate,isExactActive}"
      replace
      class="tab-item"
    >
      <span class="tab-link">排行</span>
    </router-link>
    <router-link
      to="/search"
      v-slot="{ href,route,isActive,navigate,isExactActive}"
      replace
      class="tab-item"
    >
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  font-size: 14px;
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-link {
      padding-bottom: 5px;
      color: rgba(255,255,255,0.5);
    }
    &.router-link-active {
        .tab-link {
          color: #ffcd32;
          border-bottom: 2px solid #ffcd32;
        }
      }
  }
}
</style>