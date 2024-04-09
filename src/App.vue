<template>
  <v-app id="inspire">
    <div
      id="appBarContainer"
      :style="'max-width: ' + gamenWidth + 'px; width:' + gamenWidth + 'px;'"
    >
      <AppBar />
    </div>
    <v-container>
      <v-row>
        <v-col>
          <FormRows :rows="rows1" @update-data="onUpdateData"></FormRows>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRootState } from './utils/rootstate';
import AppBar from './views/common/AppBar.vue';
import Frm, { FrmData, FrmRow } from './common/forms';

const _search = {
  supplierCd: Frm.data(''),
  fieldWith: 6
};
const rootState = useRootState();
const gamenWidth = computed(() => rootState.gamenWidth);

const _form1: FrmRow[] = [
  Frm.row([
    Frm.col('サプライヤーコード', [[Frm.text('', '', { maxlength: 6 }), _search.supplierCd]], {
      titleWidth: _search.fieldWith
    }),
    Frm.col('サプライヤーコード', [[Frm.text('', '', { maxlength: 6 }), _search.supplierCd]], {
      titleWidth: _search.fieldWith
    })
  ])
];
const rows1 = reactive(_form1);
function onUpdateData(data: FrmData) {
  console.log(data);
}
</script>
