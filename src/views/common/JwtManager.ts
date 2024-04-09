import { useRouter } from 'vue-router';
import { useNavigation } from '../../router/navigationManager';
import screenResize from './../../utils/screenResize';
let jwt = '';

function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return '';
}

export function saveJwtToken(param: string) {
  jwt = param;
}

export function getJwtToken() {
  return jwt;
}

export function getJwtInfoGotoMenu() {
  const navigation = useNavigation();
  saveJwtToken(getQueryVariable('token'));
  // 現在開いているURLを取得する
  const url = window.location.href;
  // URLを解析する
  const urlParser = new URL(url);
  // Queryパラメーターがある場合、抽出しURLから除去する
  if (urlParser.search) {
    //製造ベンダー直接起動（半製品、商品）
    const projectFlag = urlParser.searchParams.get('projectFlag');
    if (projectFlag) {
      let newURL = '';
      let params = {};
      let id = '';
      //製造ベンダーから直接に半製品を起動する場合
      if (projectFlag === '0') {
        navigation.setShowHomeBtn();
        navigation.setCloseFlg(false);
        newURL = urlParser.origin + urlParser.pathname + urlParser.hash + 'Lmc01031';
        let sanbutuHanseihinCode = urlParser.searchParams.get('sanbutuBetuHanseihinCode');
        sanbutuHanseihinCode = sanbutuHanseihinCode ? sanbutuHanseihinCode : '';
        let venderCode = urlParser.searchParams.get('venderCd');
        venderCode = venderCode ? venderCode : '';
        id = 'Lmc01031';
        params = { name: id, appBarTitleId: id, projectFlag: '0', sanbutuBetuHanseihinCode: sanbutuHanseihinCode, venderCd: venderCode };
      } else if (projectFlag === '1') {
        navigation.setShowHomeBtn();
        navigation.setCloseFlg(false);
        //製造ベンダーから直接に商品を起動する場合
        newURL = urlParser.origin + urlParser.pathname + urlParser.hash + 'Lmp01031';
        let siyoBetuSyohinCd = urlParser.searchParams.get('siyoBetuSyohinCd');
        siyoBetuSyohinCd = siyoBetuSyohinCd ? siyoBetuSyohinCd : '';
        let venderCode = urlParser.searchParams.get('venderCd');
        venderCode = venderCode ? venderCode : '';
        id = 'Lmp01031';
        params = { name: id, appBarTitleId: id, projectFlag: '1', siyoBetuSyohinCd: siyoBetuSyohinCd, venderCd: venderCode };
      }
      window.history.replaceState(null, document.title, newURL);
      navigation.set(`${id}`, params);
    } else {
      // Queryパラメーターを除去したURLを作成し、現在のURLと置き換える
      // この時、ページのリロードを発生させないため,replaceStateを呼び出す
      const newURL = urlParser.origin + urlParser.pathname + urlParser.hash + 'menu';

      window.history.replaceState(null, document.title, newURL);
      const router = useRouter();
      router.replace('menu');
    }

    //現在のブラウザのウインドウをリサイズする。
    screenResize.resizeTo();
  }

}
