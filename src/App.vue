<script setup>
import MHeader from "@/components/m-header/m-header.vue";
import tab from "@/components/tab/tab.vue";
import Player from "@/components/player/player.vue";
</script>

<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
  <player></player>
</template>

<style>
</style>
