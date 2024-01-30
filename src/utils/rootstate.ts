import { inject } from "vue";

export interface RootState {
  default: string;
  breadcrumbsItems: string[];
  gamenWidth: number;
}

export const defaultState: RootState = {
  default: '',
  breadcrumbsItems: [],
  gamenWidth: 1190
};

export const stateName = 'rootState';

export function useRootState(): RootState {
  return inject(stateName) || defaultState;
}
