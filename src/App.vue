<script setup>
import MHeader from "@/components/m-header/m-header.vue";
import tab from "@/components/tab/tab.vue";
import Player from "@/components/player/player.vue";
</script>

<template>
  <m-header></m-header>
  <tab></tab>
  <router-view v-slot="{ Component }">
    <transition :appear="true" name="slide">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <player></player>
</template>

<style>
</style>
