import { inject } from "vue";

export interface RootState {
  default: string;
  breadcrumbsItems: string[];
  gamenWidth: number;
  gamenMode: string;
  showHomeBtn: boolean;
  openByBrowserFlg: boolean;
  closeFlg: boolean;
}

export const defaultState: RootState = {
  default: '',
  breadcrumbsItems: [],
  gamenWidth: 1190,
  gamenMode: '',
  showHomeBtn: true,
  openByBrowserFlg: false,
  closeFlg: true,
};

export const stateName = 'rootState';

export function useRootState(): RootState {
  return inject(stateName) || defaultState;
}
