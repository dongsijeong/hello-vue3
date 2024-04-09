import tabIndexCode from '../constant/tabIndexCode';
interface State {
  gamenModeNme: string;
  clearfunc: any[];
  dataCache: any[];
  tabindx: number;
  goback: string;
  selectMode: string;
  initTabIndex: any[];
  oldModId: string;
  activeTabIndex?: number;
  activeModid: string;
  registerFlg: string;
  approveFlg: string;
}
const state: State = {
  gamenModeNme: '',
  clearfunc: [],
  dataCache: [],
  tabindx: 0,
  goback: '',
  selectMode: '',
  initTabIndex: [],
  oldModId: '',
  activeModid: '',
  registerFlg: '',
  approveFlg: ''
};
function getModeId() {
  if (state.oldModId) {
    return state.oldModId;
  }
  if (state.activeModid === tabIndexCode.TABCODE_ADD) {
    return 'ADD';
  } else if (state.activeModid === tabIndexCode.TABCODE_NEXT_ADD) {
    return 'NEXT';
  } else if (state.activeModid === tabIndexCode.TABCODE_NEW_NEXT_ADD) {
    return 'NEXT';
  } else if (state.activeModid === tabIndexCode.TABCODE_COPY) {
    return 'COPY';
  } else if (state.activeModid === tabIndexCode.TABCODE_DELETE) {
    return 'DELETE';
  } else if (state.activeModid === tabIndexCode.TABCODE_DELETECANCEL) {
    return 'DEL_CANCEL';
  } else if (state.activeModid === tabIndexCode.TABCODE_REFERENCE) {
    return 'VIEW';
  } else if (state.activeModid === tabIndexCode.TABCODE_MODIFY) {
    return 'MODIFY';
  } else if (state.activeModid === tabIndexCode.TABCODE_REPLACE) {
    return 'REPLACE';
  } else {
    return '';
  }
}
function isCallClear() {
  if (state.tabindx === -1) {
    return true;
  }
  const modeId = getModeId();
  if (modeId === 'DELETE' && state.goback !== '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  if ((modeId === 'DEL_CANCEL' || modeId === 'COPY' || modeId === 'ADD' || modeId === 'NEXT') && state.registerFlg === '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  if ((modeId === 'DEL_CANCEL' || modeId === 'COPY' || modeId === 'ADD' || modeId === 'NEXT') && state.goback !== '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  if (modeId === 'REPLACE' && state.goback !== '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  return false;
}
function isInitTabindx() {
  if (state.tabindx === -1) {
    return true;
  }
  const modeId = getModeId();
  if (modeId === 'DELETE' && state.goback !== '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  
  if ((modeId === 'DEL_CANCEL' || modeId === 'COPY' || modeId === 'ADD' || modeId === 'NEXT') && state.registerFlg === '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  if ((modeId === 'DEL_CANCEL' || modeId === 'COPY' || modeId === 'ADD' || modeId === 'NEXT') && state.goback !== '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }

  if (modeId === 'REPLACE' && state.goback !== '1') {
    if (state.selectMode === '1') {
      return false;
    }
    return true;
  }
  return false;
}

function isReset() {
  if (state.tabindx === -1) {
    return false;
  }
  const modeId = getModeId();
  if (modeId === 'VIEW' || modeId === 'MODIFY') {
    return true;
  } else if (modeId === 'DELETE' && state.goback === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'DEL_CANCEL' && state.goback === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'COPY' && state.goback === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'ADD' && state.goback === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'NEXT' && state.goback === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'DELETE' && state.selectMode === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'DEL_CANCEL' && state.selectMode === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'REPLACE' && state.goback === '1' && state.registerFlg !== '1') {
    return true;
  } else if (modeId === 'REPLACE' && state.selectMode === '1' && state.registerFlg !== '1') {
    return true;
  }

  return false;
}
export function usertnBtnManger() {
  return {
    async setData(data: any) {
      state.dataCache.splice(0);
      state.dataCache.push(data);
    },
    async setGamanMode(tabs: any, indx?: number) {
      if (tabs) {
        tabs.forEach((element: any) => {
          if (element.tabCode === tabIndexCode.TABCODE_REFERENCE) {
            state.activeTabIndex = element.tabIndex;
            return;
          }
        });
        tabs.forEach((element: any) => {
          if (element.tabIndex === indx) {
            state.activeModid = element.tabCode;
            return;
          }
        });
      }
    },
    async settabindx(index: number) {
      state.tabindx = index;
    },
    async setClearFunc(clear: any) {
      state.clearfunc.push(clear);
    },
    setSelectMode(flg: string) {
      state.selectMode = flg;
    },
    setGOback(flg?: string) {
      if (flg) {
        state.goback = flg;
      } else {
        state.goback;
      }
    },
    setRegisterFlg(flg: string) {
      state.registerFlg = flg;
    },
    setApproveFlg(flg: string) {
      state.approveFlg = flg;
    },
    getApproveFlg() {
      return state.approveFlg;
    },

    getReturnData() {
      if (isReset()) {
        if (state.dataCache.length > 0) {
          const data = state.dataCache[0];
          return data;
        }
      } else {
        state.dataCache.splice(0);
        return null;
      }
    },
    celarTabIndex() {
      if (isInitTabindx() && state.initTabIndex.length > 0) {
        const func = state.initTabIndex.pop();
        if (func) {
          const modeId = getModeId();
          state.oldModId = modeId;
          func(state.activeTabIndex);
        }
      }
    },
    clearerrBack() {
      state.dataCache.splice(0);
    },
    async setClearTabindex(initTabindex: (index: number) => void) {
      if (state.initTabIndex.length > 1) {
        return;
      }
      state.initTabIndex.push(initTabindex);
    },
    async clear() {
      state.dataCache.splice(0);
      state.clearfunc.splice(0);
      state.goback = '';
      state.registerFlg = '';
      state.tabindx = 0;
      state.selectMode = '';
      state.initTabIndex.splice(0);
      state.oldModId = '';
    },
    async reset() {
      if (isCallClear()) {
        if (state.clearfunc.length > 0) {
          const func = state.clearfunc.pop();
          if (func) {
            func();
          }
        }
      }
      state.selectMode = '';
      state.goback = '';
      state.registerFlg = '';
      state.tabindx = 0;
      state.oldModId = '';
    }
  };
}
