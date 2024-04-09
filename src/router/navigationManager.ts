import { NavigationGuardNext, Router,  } from 'vue-router';
import { useRouter } from 'vue-router';
import { useRootState } from '../utils/rootstate';
import jwt from 'jsonwebtoken';
import { EventEmitter } from 'events';
import { fetchComponent } from '../common/screenmanager';
import { gamenModeNameDefs, GamenModeItem } from '../common/gamenModeManager';
import { clearMessage } from '../utils/messageUtils';
import { screenNameDefs, ScreenNameItem } from '../common/screenNameManager';
import { clearerr } from '../utils/request';
import { usertnBtnManger } from '../utils/returnButtonManger';

// JWT生成時のシークレットキー
const SECRET_KEY = 'lawson';

// 有効なJWTの許容時間(秒)
const VALID_IAT_PERIOD = 100;

interface AuthToken {
  iat: number;
}

// ユーザー認証情報(現在未使用)
interface UserAuthToken extends AuthToken {
  UserCode?: string;
  DeptCode?: string;
}

interface State {
  enabled: boolean;
  init: boolean;
  authValue: string;
  viewValue: string;
  authToken: AuthToken | null;
  userAuthToken: UserAuthToken | null;
  lockNavigationRequest: boolean;
  lockNavigation: boolean;
  urlOrigin: string;
  urlPathname: string;
  navigationHistory: NavigationHistoryItem[];
  eventEmitter: EventEmitter;
  gamenModeNme: string;
  gamenReturnControl: boolean;
  clearfunc: any[];
  clearfuncId: string[];
  cleargoback: any[];
  initTabIndex: any[];
  windowOpenArray: Window[];
}

interface NavigationHistoryItem {
  name: string;
  params: any;
}

// ナビゲーションマネージャーの状態管理
const state: State = {
  enabled: false,
  init: false,
  authValue: '',
  viewValue: '',
  authToken: null,
  userAuthToken: null,
  lockNavigationRequest: false,
  lockNavigation: false,
  urlOrigin: '',
  urlPathname: '',
  navigationHistory: [],
  eventEmitter: new EventEmitter(),
  gamenModeNme: '',
  gamenReturnControl: false,
  clearfunc: [],
  clearfuncId: [],
  cleargoback: [],
  initTabIndex: [],
  windowOpenArray: []
};

/**
 * 指定したkeyのパラメーターの値を取得する
 * @param params 分解したQueryパラメーター情報
 * @param key
 * @returns
 */
function getParamValue(params: string[][], key: string): string {
  const param = params.find(item => item[0] === key);
  return param ? param[1] : '';
}

/**
 * 現在のUnixTimeを取得する
 * @returns UnixTime
 */
function getUnixTime() {
  return Math.floor(Date.now() / 1000);
}
function cleargoback() {
  const func = state.cleargoback.pop();
  if (func) {
    func();
  }
  state.cleargoback.splice(0);
}
function celarTabIndex() {
  if (state.initTabIndex.length > 0) {
    const func = state.initTabIndex.pop();
    if (func) {
      func();
    }
  }
}
function clearcache() {
  for (let i = 0; i < state.clearfunc.length; i++) {
    const clearfunc = state.clearfunc[i];
    if (clearfunc) {
      clearfunc();
    }
  }
  for (let i = 0; i < state.cleargoback.length; i++) {
    const clearfunc = state.cleargoback[i];
    if (clearfunc) {
      clearfunc();
    }
  }
  state.cleargoback.splice(0);
  state.clearfunc.splice(0);
  state.clearfuncId.splice(0);
}
/**
 * JWTのデコードを行う
 * @param authInfo 認証JWT文字列
 * @returns
 */
function verifyAuthInfo(authInfo: string, checkValidTime = true): AuthToken | null {
  let token: AuthToken;
  try {
    token = jwt.verify(authInfo, SECRET_KEY) as AuthToken;
  } catch (err) {
    console.log('トークンのデコード失敗');
    return null;
  }
  // JWTの有効時間チェック
  const currentTime = getUnixTime();
  if (checkValidTime && currentTime - token.iat > VALID_IAT_PERIOD) {
    return null;
  }
  return token;
}

/**
 * ユーザーの認可情報を取得する
 * @param token
 * @returns
 */
function getUserAuthInfo(token: AuthToken): Promise<UserAuthToken> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(token);
    }, 1000);
  });
}

/**
 * Queryパラメーターのviewキーワードで指定されたマスターデータを開く
 * @param value マスターデータを開くための文字列
 * @param next ルーターに対する次のアクションを指定する関数
 */
function viewData(value: string, next: NavigationGuardNext) {
  const values = value.split(',');
  state.lockNavigationRequest = true;
  next({ name: values[0], replace: true, params: { id: values[1] } });
}

/**
 * 画面起動時に取得したトークンのiatを最新値トークンを生成する
 * @returns 認証トークンを返す
 */
function getAuthToken() {
  const token = Object.assign({}, state.authToken) as AuthToken;
  token.iat = 0;
  return jwt.sign(token, SECRET_KEY);
}

/**
 * 別ウィンドウでマスターデータを開くためのURLを取得する
 * 認証情報を引き継ぐ
 * @param viewName マスターデータ種別
 * @param id マスターデータレコードID
 * @returns
 */
export function getViewURL(viewName: string, id: string): string {
  const newURL = state.urlOrigin + state.urlPathname + '?auth=' + getAuthToken() + '&view=' + viewName + ',' + encodeURIComponent(id);
  return newURL;
}

/**
 * 画面遷移時に呼び出されるコールバックを実装する
 * 画面の初期化や、別ウィンドウで開くときのアクションを実行する
 * @param to
 * @param from
 * @param next
 * @returns
 */
export async function onAppNavigate(to: any, from: any, next: NavigationGuardNext): Promise<void> {
  if (!state.enabled) {
    next();
    return;
  }
  if (state.init === false) {
    // 最初の画面ロード
    state.init = true;
    if (!state.authValue) {
      // 認証情報がなければエラーページを表示する
      next({ name: 'initerror', params: { message: '認証情報が必要です' } });
      state.lockNavigationRequest = true;
      return;
    }

    // 認証情報のデコード
    state.authToken = verifyAuthInfo(state.authValue);
    if (!state.authToken) {
      // 認証情報をデコードできなければエラーページを表示する
      next({ name: 'initerror', params: { message: '不正な認証トークンです' } });
      state.lockNavigationRequest = true;
      return;
    }

    // 認可情報取得
    try {
      state.userAuthToken = await getUserAuthInfo(state.authToken);
      console.log('first navigate ' + to.query);
    } catch (err) {
      // 認可情報を取得できなければエラーページを表示する
      next({ name: 'initerror', params: { message: 'ユーザー資格情報が確認できません' } });
      state.lockNavigationRequest = true;
      return;
    }

    // 直接画面表示
    if (state.viewValue) {
      viewData(state.viewValue, next);
    } else {
      next();
    }
    return;
  }
  if (state.lockNavigation) {
    next(false);
    console.log('画面遷移無効');
    return;
  }
  if (state.lockNavigationRequest) {
    state.lockNavigation = true;
  }
  console.log(`route-> ${to.fullPath}`);
  next();
}

/**
 * ローカルストレージから認証キャッシュ情報を取得する
 * @returns 認証キャッシュ
 */
function loadAuthcache(): string {
  return '';
  // 開発時の利便性のためJWTのキャッシュ機構を実装する
  // let authValueCache = localStorage.getItem('auth_cache') || '';
  // if (authValueCache) {
  //     const authToken = verifyAuthInfo(authValueCache, false);
  //     if (authToken) {
  //         // IATを現在時刻に更新しておく
  //         authToken.iat = 0;
  //         authValueCache = jwt.sign(authToken, SECRET_KEY);
  //     } else {
  //         // 無効な認証キャッシュであるためキャッシュをクリアする
  //         authValueCache = '';
  //         saveAuthCache('');
  //     }

  // }
  // return authValueCache;
}

/**
 * 認証情報をローカルストレージに保存する
 * @param authValue 認証キャッシュ
 */
function saveAuthCache(authValue: string) {
  if (authValue) {
    localStorage.setItem('auth_cache', authValue);
  }
}

export function startup(): void {
  // 現在開いているURLを取得する
  const url = window.location.href;
  // URLを解析する
  const urlParser = new URL(url);

  // Queryパラメーターがある場合、抽出しURLから除去する
  if (urlParser.search) {
    // Queryパラメーターを分解する
    const queryParams = urlParser.search
      .substr(1)
      .split('&')
      .map(text => text.split('=').map(item => decodeURIComponent(item)));
    state.authValue = getParamValue(queryParams, 'auth');
    state.viewValue = getParamValue(queryParams, 'view');

    // Queryパラメーターを除去したURLを作成し、現在のURLと置き換える
    // この時、ページのリロードを発生させないため,replaceStateを呼び出す
    const newURL = urlParser.origin + urlParser.pathname + urlParser.hash;
    window.history.replaceState(null, document.title, newURL);
  }

  state.urlOrigin = urlParser.origin;
  state.urlPathname = urlParser.pathname;

  // 開発時の利便性のためJWTのキャッシュ機構を実装する
  state.authValue = state.authValue || loadAuthcache();
  saveAuthCache(state.authValue);

  // 起動シーケンスを有効化する
  state.enabled = true;
}

async function internalPush(router: Router, name: string, params: any) {
  const names = name.split('/');
  for (const id of names) {
    const componentLoaded = await fetchComponent(id);
    if (!componentLoaded) {
      // コンポーネントがロードできない
      return;
    }
  }
  const id = names[0];
  const rtnBth = usertnBtnManger();
  // 各種Stateの取り出し
  const historyItem = { name: id, params: { ...params, keepState: true, gamenMode: state.gamenModeNme } };
  if (state.navigationHistory.length == 0 && name == 'menu') {
    clearcache();
    cleargoback();
    celarTabIndex();
    rtnBth.clear();
    rtnBth.setApproveFlg('');
  }

  state.navigationHistory.push(historyItem);
  const item = { name: id, params };
  // if(id == router.currentRoute.name && id == 'menu'){
  //     return;
  // }
  router.replace(item);
}

async function internalResolve(router: Router, name: string, params?: any) {
  const names = name.split('/');
  for (const id of names) {
    const componentLoaded = await fetchComponent(id);
    if (!componentLoaded) {
      // コンポーネントがロードできない
      return;
    }
  }
  const id = names[0];
  if (params === undefined) {
    params = '';
  }
  const WIDTH = screen.availWidth * 0.8;
  const HEIGHT = screen.availHeight;
  const features = 'toolbar=no,resizable=yes,' + 'height=' + HEIGHT + ',width=' + WIDTH;
  const item = { name: id, query: params };
  const { href } = router.resolve(item);
  const windowsItem = window.open(href, '_blank', features);
  if (windowsItem) {
    state.windowOpenArray.push(windowsItem);
  }
}
function internalGoBack(router: Router, params: any = {}) {
  if (state.navigationHistory.length < 2) {
    return;
  }
  state.navigationHistory.pop();

  const item = state.navigationHistory[state.navigationHistory.length - 1];
  if (item) {
    cleargoback();
    item.params = Object.assign(item.params, params);
    router.replace(item);
  }
}
function getGamenModeName(gamenModeId: string) {
  state.gamenModeNme = '';
  state.gamenReturnControl = false;
  if (gamenModeId !== undefined && gamenModeId !== '') {
    gamenModeNameDefs.filter((item: GamenModeItem) => {
      if (gamenModeId === item.gamenModeId) {
        state.gamenModeNme = item.gamenModeName;
        state.gamenReturnControl = item.gamenReturnControl;
      }
    });
  }
}
function getGamenModeIdByName(gamenModeName: string) {
  let gamenModeId = '';
  if (gamenModeName !== undefined && gamenModeName !== '') {
    gamenModeNameDefs.filter((item: GamenModeItem) => {
      if (gamenModeName === item.gamenModeName) {
        gamenModeId = item.gamenModeId;
      }
    });
  }
  return gamenModeId;
}
export function useNavigation() {
  const router = useRouter();
  // 各種Stateの取り出し
  const rootState = useRootState();
  return {
    getHistory() {
      return state.navigationHistory;
    },
    async set(name: string, params: any) {
      clearerr();
      clearMessage();
      state.navigationHistory = [];
      if (name === '') {
        rootState.breadcrumbsItems.splice(0);
        // rootState.breadcrumbsItems.push({ text: '生産加工システム' });
        const screenId = params.appBarTitleId ? params.appBarTitleId : '';
        screenNameDefs.filter((item: ScreenNameItem) => {
          if (screenId === item.screenId) {
            const screenName = item.screenName;
            const text = `${screenId} ${screenName}`;
            rootState.breadcrumbsItems.push( text );
          }
        });
      }
      await internalPush(router, name, params);
      state.eventEmitter.emit('jumpTo');
    },
    async register(clear: any, id?: string) {
      if (clear) {
        const funcid = id ? id : state.navigationHistory[state.navigationHistory.length - 1].name;
        if (state.clearfuncId.indexOf(funcid) == -1) {
          state.clearfunc.push(clear);
          state.clearfuncId.push(funcid);
        }
      }
    },
    async setClearTabindex(initTabindex: () => void) {
      if (state.initTabIndex.length > 1) {
        return;
      }
      state.initTabIndex.push(initTabindex);
    },
    async registergoback(clear: any, id?: string) {
      if (clear) {
        state.cleargoback.push(clear);
      }
    },
    async push(name: string, params: any) {
      clearerr();
      clearMessage();
      await internalPush(router, name, params);
      state.eventEmitter.emit('push');
    },
    pop(params: any = {}) {
      clearerr();
      clearMessage();
      if (state.navigationHistory.length >= 2) {
        const item = state.navigationHistory[state.navigationHistory.length - 1];
        if (item) {
          rootState.gamenMode = item.params.gamenMode;
        }
      }
      internalGoBack(router, params);
      state.eventEmitter.emit('goBack');
    },
    async resolve(name: string, params?: any) {
      clearMessage();
      internalResolve(router, name, params);
      state.eventEmitter.emit('jumpTo');
    },
    on(event: string, listener: (...args: any) => void) {
      clearerr();
      clearMessage();
      state.eventEmitter.on(event, listener);
    },
    off(event: string, listener: (...args: any) => void) {
      clearerr();
      clearMessage();
      state.eventEmitter.off(event, listener);
    },
    setGamenMode(gamenModeId: string) {
      if (gamenModeId.toUpperCase() === 'VIEW') {
        document.documentElement.scrollTop = 0;
      }

      getGamenModeName(gamenModeId);
      rootState.gamenMode = state.gamenModeNme;
    },
    getGamenMode() {
      return rootState.gamenMode;
    },
    getGamenReturnControl() {
      return state.gamenReturnControl;
    },
    getGamenModeId() {
      return getGamenModeIdByName(rootState.gamenMode);
    },
    setShowHomeBtn() {
      rootState.showHomeBtn = false;
    },
    setCloseFlg(flg: boolean) {
      rootState.closeFlg = flg;
    },
    setOpenByBrowserFlg() {
      rootState.openByBrowserFlg = true;
    },
  };
}
