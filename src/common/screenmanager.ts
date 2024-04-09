import { FrmInput, FrmRow, FrmData, FrmTableColumn, FrmRowTab } from './forms';
import { routes } from '../router/autoroutes';

export interface ButtonActionStyle {
  width?: string;
  color?: string;
}

export interface ButtonAction {
  text: string;
  action: (buttonInfo: ButtonAction, selected: any[]) => void;
  style: ButtonActionStyle;
}

export interface ScreenMetaInfo {
  id: string;
  title: string;
  data: any;
  creatable: boolean;
  searchButtonDisabled?: boolean;
  actions: ButtonAction[];
  conditionFieldList: FrmRow[];
  tableHeaders: FrmTableColumn[];
  tableItems: any[];
  tableMaxHeight: string;
  tabs?: FrmRowTab[];
  activeTabIndex?: number;
  labelMessage?: string;
  midLabelMessage?: string;
  buttonDispLabel?: string[];
  buttonDispFlag?: boolean;
  buttonCSVDispFlag?: boolean;
  disableSort?: boolean;
  buttonCallBack?: () => void;
  params?: {};
  checkData?: (item: any, currentTabIndex?: number) => void;
  updateHook?: (data: FrmData, formData: any) => void;
  selectData?: (data: FrmData, formData: any) => void;
  initData?: (data: FrmData, formData: any) => void;
  selectBtnClick?: (props: any, selectBtnClickCallback: Function) => void;
  clearValue?: (data: any, formData: any) => void;
  isDisplayLink?: (item: any) => boolean;
  screenId?: string;
  sortBy?: string[];
  sortDesc?: boolean[];
}

const metaInfoStore: { [key: string]: ScreenMetaInfo } = {};

export function defineScreen(meta: ScreenMetaInfo): ScreenMetaInfo {
  metaInfoStore[meta.id] = meta;
  return meta;
}

export async function fetchComponent(screenID: string): Promise<boolean> {
  const pageInfo: any = routes.find(item => item.name === screenID);
  if (!pageInfo) {
    return false;
  }
  // dynamic loading
  await pageInfo.component();
  return true;
}

export function getScreenInfo(screenID: string): ScreenMetaInfo | null {
  return metaInfoStore[screenID];
}
