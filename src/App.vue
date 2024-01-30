<template>
  <v-app id="inspire">
    <div id="appBarContainer" :style="'max-width: ' + gamenWidth + 'px; width:' + gamenWidth + 'px;'">
      <AppBar />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRootState } from './utils/rootstate';
import AppBar from './views/common/AppBar.vue';

const rootState = useRootState();
const gamenWidth = computed(() => rootState.gamenWidth);
</script>
<style>
#app {
  font-family: Meiryo UI;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 13px;
}
.v-application {
  font-family: Meiryo UI !important;
}
</style>
