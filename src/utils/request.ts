import axios from 'axios';
import qs from 'qs';
import { setMessageAndType, getMessage, showLoadPage, hiddenLoadPage, getShowFlag } from './messageUtils';
import { getJwtToken, saveJwtToken } from '../views/Common/JwtManager';
import { FrmData } from '../common/forms';
import { getActionId, getActionName } from './requestInfo';
import router from '../router';
// axiosを新規
const service = axios.create({
  timeout: 3600000, // TimeOut時間
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  }
});

service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = getJwtToken();
    config.headers['ActionId'] = getActionId();
    config.headers['ActionName'] = getActionName();
    // TODO画面にLoading状態になる
    showLoadPage();
    if (getActionName() === 'checkStatus') {
      getShowFlag().showFlag = false;
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log('request: ', error);
    hiddenLoadPage();
    // store.dispatch('app/setBtnLoading', !1);
    Promise.reject(error);
  }
);

let _fields: any = null;
let _backfields: any = null;
let _exFields: any = null;
let _fieldsList: any = null;
let _backfieldsList: any = null;

export function setfields(fields: any) {
  _fields = fields;
  _backfields = fields;
}
export function setfieldsEx(fields: any, exFields: any) {
  _fields = fields;
  _backfields = fields;
  _exFields = exFields;
}
export function setfieldsList(fieldsList: any) {
  _fieldsList = fieldsList;
  _backfieldsList = fieldsList;
}

export function clearerr() {
  if (_backfields) {
    const fieldKeys = _backfields.constructor.keys(_backfields);
    fieldKeys.forEach((key: any) => {
      if (typeof _backfields[key] === 'object' && _backfields[key] && _backfields[key]['errors']) {
        _backfields[key]['errors'] = [];
      }
    });
  }
  if (_backfieldsList) {
    for (let i = 0; i < _backfieldsList.length; i++) {
      const backfields = _backfieldsList[i];
      const fieldKeys = backfields.constructor.keys(backfields);
      fieldKeys.forEach((key: any) => {
        if (typeof backfields[key] === 'object' && backfields[key] && backfields[key]['errors']) {
          backfields[key]['errors'] = [];
        }
      });
    }
  }
}

service.interceptors.response.use(
  response => {
    clearerr();
    const res = response.data;
    hiddenLoadPage();
    if (response.data.token) {
      saveJwtToken(response.data.token);
    }
    // store.dispatch('app/setBtnLoading', !1);
    if (res.code == null) {
      if (res.type === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(response.data, 'utf-8');
        reader.onload = () => {
          const tempResult: any = reader.result;
          const error = JSON.parse(tempResult);
          if (error != null && error.code === 401) {
            const item = { name: 'systemError', params: { message: error.message } };
            router.replace(item);
            return Promise.reject('error');
          }
          if (error != null && error.code == '409') {
            setMessageAndType('現在システムは使用制限中です', 'error');
          } else if (_fields && error.errinfo.others) {
            for (let i = 0; i < error.errinfo.others.length; i++) {
              const filedName = error.errinfo.others[i];
              const fomdata: FrmData = _fields[filedName];
              if (fomdata) {
                fomdata.errors = fomdata.errors.concat(error.errinfo.detailMsg[i].split('<BR>'));
              }
            }
          } else {
            if (error && error.errinfo && error.errinfo.detailMsg) {
              error.errinfo.detailMsg.forEach((item: any) => {
                setMessageAndType(item, 'error');
              });
            }
          }
        };
        return Promise.reject('error');
      }
      const fileName = window.decodeURI(response.headers['content-disposition'].match(/filename=(.*)/)[1]);
      const token = response.headers['authorization'];
      if (token) {
        saveJwtToken(token);
      }
      const download: any = {};
      download.fileName = fileName;
      download.fileContent = response.data;
      return download;
    }

    if (res.code === 200) {
      _fields = null;
      _exFields = null;
      _fieldsList = null;
      if (res.message != null) {
        setMessageAndType(res.message, 'success');

        return new Promise(resolve => {
          let begin = 0;
          begin = window.setInterval(() => {
            setTimeout(() => {
              if (getMessage().length == 0) {
                clearInterval(begin);
                return resolve(res);
              }
            }, 0);
          }, 1000);
        });
      }
    }
    if (res.code === 400) {
      let alertFlg = true;
      if (_fields && res.errinfo.others) {
        for (let i = 0; i < res.errinfo.others.length; i++) {
          const filedName = res.errinfo.others[i];
          const fomdata: FrmData = _fields[filedName];

          if (fomdata) {
            fomdata.errors = fomdata.errors.concat(res.errinfo.detailMsg[i].split('<BR>'));
            alertFlg = false;
          }
          if (_exFields) {
            const exFromdata: FrmData = _exFields[filedName];
            if (exFromdata) {
              exFromdata.errors = exFromdata.errors.concat(res.errinfo.detailMsg[i].split('<BR>'));
              alertFlg = false;
            }
          }
        }
        _fields = null;
        _exFields = null;
      }
      if (_fieldsList) {
        for (let i = 0; i < _fieldsList.length; i++) {
          const fields = _fieldsList[i];
          if (res.errinfo.others) {
            for (let i = 0; i < res.errinfo.others.length; i++) {
              const filedName = res.errinfo.others[i];
              const fomdata: FrmData = fields[filedName];

              if (fomdata) {
                fomdata.errors = fomdata.errors.concat(res.errinfo.detailMsg[i].split('<BR>'));
                alertFlg = false;
              }
            }
          }
        }
        _fieldsList = null;
      }

      // チェックエラー TODO 具体的の処理を待ち
      if (alertFlg) {
        res.errinfo.detailMsg.forEach((item: any) => {
          setMessageAndType(item, 'error');
        });
      }
      return Promise.reject('error');
    }
    if (res.code === 401) {
      const item = { name: 'systemError', params: { message: res.message } };
      router.replace(item);
      return Promise.reject('error');
    }
    if (res.code === 404) {
      setMessageAndType(res.errinfo.detailMsg[0], 'error');
      _fields = null;
      _exFields = null;
      res.data = [];
      return Promise.resolve(res);
    }

    if (res.code === 409) {
      const item = { name: 'info', params: { message: res.message, flag: res.code } };
      router.replace(item);
      return Promise.reject('error');
    }
    if (res.code === 410) {
      const item = { name: 'info', params: { message: res.message, flag: res.code } };
      router.replace(item);
      return Promise.reject('error');
    }
    if (res.code === 500) {
      let message = '';
      res.errinfo.detailMsg.forEach((item: any) => {
        message = message + '\n' + item;
      });
      const item = { name: 'systemError', params: { message: message } };
      router.replace(item);
      return Promise.reject('error');
    }

    return res;
  },
  error => {
    hiddenLoadPage();
    const item = { name: 'systemError', params: { message: '' } };
    router.replace(item);
    return Promise.reject('error');
  }
);

export default service;
