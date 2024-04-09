import type { Component, App } from 'vue';
import FormRows from '@/components/FormRows.vue';
import FormRow from '@/components/FormRow.vue';
import FormInput from '@/components/FormInput.vue';

const components: {
  [propName: string]: Component;
} = {
  FormRows,
  FormRow,
  FormInput
};
export default {
  install: (app: App) => {
    for (const key in components) {
      app.component(key, components[key]);
    }
  }
};
