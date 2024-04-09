<template>
  <v-app id="inspire">
    <v-container id="jwtContainer"></v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getJwtInfoGotoMenu } from './JwtManager';

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    getJwtInfoGotoMenu();
  }
});
</script>

<style lang="scss"></style>
