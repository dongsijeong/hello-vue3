<template>
  <div>
    <v-text-field
      variant="outlined"
      hide-details="auto"
      v-if="field.type === 'text'"
      v-model="data.value"
      :prefix="field.textPrepend"
      :suffix="field.textAppend"
      :readonly="data.readOnly"
      :filled="data.readOnly"
      :style="field.style.valueStyle ? field.style.valueStyle : {}"
      :class="field.style.valueClass ? field.style.valueClass : ''"
      :maxlength="field.style.maxlength ? field.style.maxlength : ''"
      :error="data.errors ? data.errors.length > 0 : false"
      :error-count="data.errors ? data.errors.length : 0"
      :error-messages="data.errors"
      :background-color="field.style.backgroundColor ? field.style.backgroundColor : undefined"
      @input="onUpdate(data)"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import EventEmitter from 'events';
import { defineComponent, PropType, reactive, toRefs } from 'vue';
import { FrmData, FrmInputEditor, FrmOptionsItem } from './../common/forms';

export interface State {
  default: string;
}
const _state: State = {
  default: ''
};

export default defineComponent({
  name: 'FormInput',
  props: {
    field: {
      type: Object as PropType<FrmInputEditor>,
      required: true
    },
    data: {
      type: Object as PropType<FrmData>,
      required: true
    },
    ee: {
      type: Object as PropType<EventEmitter>
    }
  },
  setup(props) {
    const state = reactive(_state);
    function onUpdate(evnetData: any, event?: any) {
      //キーアップ、ペーストイベント
      if (event) {
        if (props.ee && !evnetData.disabled && !evnetData.readOnly) {
          if ('keyup' === event.type) {
            props.ee.emit('on-update-value', evnetData);
          } else if ('paste' === event.type && evnetData.pasteUpdateHookFlg) {
            //コピーの場合
            const paste = event.clipboardData.getData('text');
            const strat = event.srcElement.selectionStart;
            const end = event.srcElement.selectionEnd;

            if (evnetData.value && typeof evnetData.value === 'object') {
              if (!evnetData.value.value) {
                evnetData.value.value = paste;
              } else {
                evnetData.value.value =
                  evnetData.value.value.substring(0, strat) +
                  paste +
                  evnetData.value.value.substring(end, evnetData.value.value.length);
              }
            } else {
              if (!evnetData.value) {
                evnetData.value = paste;
              } else {
                evnetData.value =
                  evnetData.value.substring(0, strat) +
                  paste +
                  evnetData.value.substring(end, evnetData.value.length);
              }
            }
            event.preventDefault();
            props.ee.emit('on-update-value', evnetData);
          }
        }
      } else {
        //キーアップ、ペーストイベント以外の場合、アップデートを発生
        props.ee?.emit('on-update-value', evnetData);
      }
    }

    return {
      onUpdate,
      ...toRefs(state)
    };
  }
});
</script>
