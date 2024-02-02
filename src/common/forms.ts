export interface FrmOptionsItem {
  text: string;
  value: string | number | null;
}

export interface FrmData {
  value: any;
  errors: string[];
  readOnly: boolean;
  options: FrmOptionsItem[];
  pasteUpdateHookFlg: boolean;
}

export interface FrmInputEditor {
  type: string;
  options: FrmOptionsItem[];
  textAppend: string;
  textPrepend: string;
  listDialogName: string;
  listDialogPath: string;
  btnDisabled: boolean;
  singleSelection: boolean;
  style: FrmInputStyle;
  optionsType: string;
  param?: any;
  callScreenId?: string;
}

export type FrmInput = [FrmInputEditor, FrmData];

export interface FrmInputStyle {
  valueStyle?: string;
  textRows?: number;
  valueStyle?: number;
  valueCols?: number;
  maxlength?: number;
  selectBtnShow?: boolean;
  datePickerBtnShow?: boolean;
  valueClass?: string;
  backgroundColor?: string;
  isShowMinDate?: boolean;
  datePickerNL?: number;
  hint?: string;
}

export interface FrmColStyle {
  titleWidth?: number;
  valueWidth?: number;
  vertical?: boolean;
  valueCols?: number;
  rowCols?: number;
  titleStyle?: string;
  rowClass?: string;
  offset?: number;
  checktipsHidden?: boolean;
}

export interface FrmInputListStyle {
  valueStyle?: string;
  textRows?: number;
  valueWidth?: number;
  valueCols?: number;
  textWidth?: number;
  maxlength?: number;
}

export interface FrmCol {
  title: string;
  fields: FrmInput[];
  style: FrmColStyle;
}

export interface FrmRow {
  columns: FrmCol[];
  style: FrmRowStyle;
}

export interface FrmRowTab {
  tabName: string;
  tabIndex: number;
  tabCode: string;
  labelMessage?: string;
  subTabName?: string;
  subTabClass?: string;
}

export interface FrmRowStyle {
  height?: number;
}
export interface ToolTips {
  tipsMessage: string;
  tipsWidth: string;
}
export interface FrmTableColumn {
  text: string;
  value: string;
  type?: string;
  sortable?: boolean;
  divider?: boolean;
  formType?: FrmInputEditor;
  action?: string;
  width?: string;
  keyColumn?: boolean;
  textColumn?: boolean;
  align?: string;
  colDisabled?: boolean;
  toolTips?: ToolTips;
  class?: string;
  maxlength?: number;
}

function col(title: string, fields: FrmInput[], style?: FrmColStyle): FrmCol {
  return { title, fields, style: style || {} };
}

function row(columns: FrmCol | FrmCol[], style: FrmRowStyle = {}): FrmRow {
  return {
    columns: Array.isArray(columns) ? columns : [columns],
    style
  };
}

function data(value: any, readOnly = false, pasteUpdateHookFlg = false): FrmData {
  return {
    value: value,
    errors: [],
    readOnly,
    options: [],
    pasteUpdateHookFlg
  };
}

function input(
  type: string,
  options: FrmOptionsItem[],
  optionsType: string,
  textAppend: string,
  textPrepend: string,
  style: FrmInputStyle = {},
  listDialogName = '',
  listDialogPath = '',
  btnDisabled = false,
  singleSelection = true,
  param?: any,
  callScreenId?: any
): FrmInputEditor {
  return {
    type,
    options,
    optionsType,
    textAppend,
    textPrepend,
    style,
    listDialogName,
    listDialogPath,
    btnDisabled,
    singleSelection,
    param,
    callScreenId
  };
}

function text(textPrepend = '', textAppend = '', style?: FrmInputStyle): FrmInputEditor {
  return input('text', [], '', textAppend, textPrepend, style || {});
}

export default {
  data,
  col,
  row,
  text,
};
