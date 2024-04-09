<template>
  <div>
    <!-- ToolBar -->
    <v-toolbar
      id="topToolbar"
      theme="dark"
      :color="headerBkColor"
      height="34"
      :max-width="gamenWidth"
      :width="gamenWidth"
    >
      <v-icon>mdi-home</v-icon>
      <v-breadcrumbs :items="breadcrumbsItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <div style="font-size: 14px; margin-left: 10px">{{ gamenMode }}</div>
      <v-spacer />
      <v-sheet theme="dark" :color="headerBkColor">
        <v-btn
          theme="dark"
          size="x-small"
          color="#ff5252"
          style="font-size: 13px; height: 25px !important; font-weight: bold !important"
        >
          終了
        </v-btn>
      </v-sheet>
      <v-btn @click="print()"><v-icon>mdi-printer</v-icon></v-btn>
      <v-sheet
        v-dompurify-html="currentDate"
        theme="dark"
        :color="headerBkColor"
        style="font-size: 13px"
      ></v-sheet>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRootState } from '../utils/rootstate';
export interface State {
  currentDate: string;
  headerBkColor: string;
  gamenMode: string;
}
const _state: State = reactive({
  currentDate: '',
  headerBkColor: '#0072ce',
  gamenMode: '参照'
});
export default defineComponent({
  name: 'AppBar',
  setup() {
    const state = reactive(_state);
    const rootState = useRootState();
    rootState.breadcrumbsItems.splice(0);
    rootState.breadcrumbsItems.push('test1');
    rootState.breadcrumbsItems.push('test2');

    function dateToString(date: Date) {
      const weekday = ['日', '月', '火', '水', '木', '金', '土'];
      return (
        date.getFullYear() +
        '/' +
        ('00' + (date.getMonth() + 1)).slice(-2) +
        '/' +
        ('00' + date.getDate()).slice(-2) +
        '(' +
        weekday[date.getDay()] +
        ') ' +
        ('00' + date.getHours()).slice(-2) +
        ':' +
        ('00' + date.getMinutes()).slice(-2) +
        ':' +
        ('00' + date.getSeconds()).slice(-2)
      );
    }
    function setFormatDate() {
      const now = new Date();
      state.currentDate = dateToString(now);
    }
    onMounted(() => {
      setInterval(() => {
        setFormatDate();
      }, 1000);
    });

    return {
      ...toRefs(state),
      breadcrumbsItems: computed(() => rootState.breadcrumbsItems),
      gamenWidth: computed(() => rootState.gamenWidth)
    };
  }
});
</script>
<style scoped>
#topToolbar {
  outline: solid;
  outline-color: #929399;
  outline-width: thin;
  font-weight: bold !important;
}
</style>
