<template>
  <v-row no-gutters dense>
    <v-col
      v-for="(column, colIndex) in row.columns"
      :key="colIndex"
      :cols="row.columns[colIndex].style.rowCols || ''"
      :offset="row.columns[colIndex].style.offset ? row.columns[colIndex].style.offset : 0"
    >
      <v-row no-gutters dense v-if="column.style.vertical">
        <v-col class="prop-label">{{ column.title }}</v-col>
      </v-row>
      <v-row no-gutters dense>
        <v-col
          :cols="column.style.titleWidth || 4"
          :class="column.style.titleStyle ? column.style.titleStyle : 'prop-label'"
          v-if="
            !column.style.vertical &&
            column.title !== ' ' &&
            column.fields &&
            column.fields[0] &&
            column.fields[0][0] &&
            column.fields[0][0].type !== 'checktips'
          "
          v-dompurify-html="column.title"
        ></v-col>
        <v-col
          :cols="column.style.titleWidth || 4"
          :class="column.style.titleStyle ? column.style.titleStyle : 'prop-label'"
          v-if="
            !column.style.vertical &&
            column.fields &&
            column.fields[0] &&
            column.fields[0][0] &&
            column.fields[0][0].type === 'checktips'
          "
        >
          {{ column.title }}
          <v-tooltip bottom color="#fff">
            <template v-slot:activator="{ on }">
              <v-icon
                dense
                dark
                :color="true !== column.style.checktipsHidden ? '#00a3e0' : '#929399'"
                v-on="on"
              >
                mdi-help-circle
              </v-icon>
            </template>
            <v-textarea
              dense
              outlined
              hide-details="auto"
              disabled
              v-model="column.fields[0][0].textPrepend"
              class="tooltiptextarea textareaRed"
              auto-grow
              :rows="column.fields[0][0].style.textRows"
              :style="
                column.fields[0][0].style.valueWidth
                  ? { width: column.fields[0][0].style.valueWidth + 'px' }
                  : {}
              "
              v-if="true !== column.style.checktipsHidden"
            ></v-textarea>
          </v-tooltip>
        </v-col>

        <v-col class="prop-value" :cols="column.style.valueCols || ''">
          <v-row no-gutters dense>
            <v-col v-for="(field, fieldIndex) in column.fields" :key="fieldIndex">
              <FormInput
                :ee="ee"
                :field="field[0]"
                :data="field[1]"
                v-if="
                  field &&
                  (field[0] == null || field[0].type != 'check' || column.fields.length <= 6)
                "
              ></FormInput>
            </v-col>
          </v-row>
          <span v-for="(field, fieldIndex) in column.fields" :key="fieldIndex">
            <v-row
              v-if="
                field && field[0].type == 'check' && column.fields.length > 6 && fieldIndex % 6 == 0
              "
            >
              <v-col cols="2">
                <FormInput
                  :ee="ee"
                  :field="column.fields[fieldIndex][0]"
                  :data="column.fields[fieldIndex][1]"
                  class="checkboxNowarp"
                ></FormInput>
              </v-col>
              <v-col v-if="fieldIndex + 1 < column.fields.length" cols="2">
                <FormInput
                  :ee="ee"
                  :field="column.fields[fieldIndex + 1][0]"
                  :data="column.fields[fieldIndex + 1][1]"
                  class="checkboxNowarp"
                ></FormInput>
              </v-col>
              <v-col v-if="fieldIndex + 2 < column.fields.length" cols="2">
                <FormInput
                  :ee="ee"
                  :field="column.fields[fieldIndex + 2][0]"
                  :data="column.fields[fieldIndex + 2][1]"
                  class="checkboxNowarp"
                ></FormInput>
              </v-col>
              <v-col v-if="fieldIndex + 3 < column.fields.length" cols="2">
                <FormInput
                  :ee="ee"
                  :field="column.fields[fieldIndex + 3][0]"
                  :data="column.fields[fieldIndex + 3][1]"
                  class="checkboxNowarp"
                ></FormInput>
              </v-col>
              <v-col v-if="fieldIndex + 4 < column.fields.length" cols="2">
                <FormInput
                  :ee="ee"
                  :field="column.fields[fieldIndex + 4][0]"
                  :data="column.fields[fieldIndex + 4][1]"
                  class="checkboxNowarp"
                ></FormInput>
              </v-col>
              <v-col v-if="fieldIndex + 5 < column.fields.length" cols="2">
                <FormInput
                  :ee="ee"
                  :field="column.fields[fieldIndex + 5][0]"
                  :data="column.fields[fieldIndex + 5][1]"
                  class="checkboxNowarp"
                ></FormInput>
              </v-col>
            </v-row>
          </span>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { EventEmitter } from 'events';

export default defineComponent({
  props: {
    row: {
      type: Object,
      required: true
    },
    ee: {
      type: Object as PropType<EventEmitter>
    }
  }
});
</script>
