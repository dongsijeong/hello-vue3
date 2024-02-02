<template>
  <v-form id="content" @submit.native.prevent>
    <FormRow
      :ee="ee"
      v-for="(row, index) in rows"
      :key="index"
      :row="row"
      :style="(row.style || {}).height ? { height: row.style.height + 'px' } : {}"
    ></FormRow>
  </v-form>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { EventEmitter } from 'events';
import { FrmData } from './../common/forms';

export default defineComponent({
  name: 'FormRows',
  props: {
    rows: {
      type: Array,
      required: true
    }
  },
  setup(prop, context) {
    const eventEmitter = new EventEmitter();
    let updateLock = false;

    function handleUpdate(data: FrmData) {
      if (updateLock) {
        return;
      }
      updateLock = true;
      context.emit('update-data', data);
      updateLock = false;
    }

    eventEmitter.on('on-update-value', handleUpdate);

    return {
      ee: eventEmitter,
      emit: context.emit
    };
  },
  emits: ['update-data']
});
</script>
