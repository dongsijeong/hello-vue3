let _actionId: string;
let _actionName: string;
export const actionName = {
  // 登録ボタン押下
  reg: 'reg',
  // 削除ボタン押下
  del: 'del',
  // 更新ボタン押下
  upd: 'upd',
  // 検索ボタン押下
  sel: 'sel',
  // 画面初期化
  init: 'init',
  // ダウンロードデータ作成ボタン押下
  processDownload: 'processDownload',
  // ファイルダウンロードステータスチェック
  checkStatus: 'checkStatus',
  // ダウンロードボタン押下
  down: 'down',
  // アップロードボタン押下
  up: 'up',
  // 承認ボタン押下
  admit: 'admit',
  // 印刷ボタン押下
  print: 'print',
  // 実行ボタン押下
  execute: 'execute',
  // タブ切換える
  tabChange: 'tabChange',
  // サーマルラベル表示内容確認表ボタン押下
  sealView: 'sealView',
  // 盛付ボタン押下
  fill: 'fill',
  // 分割ボタン押下
  division: 'division',
  // 原材料/半製品投入ボタン押下
  throw: 'throw',
  // 原材料一覧ボタン押下
  raw: 'raw',
  // 構成表示ボタン押下
  component: 'component',
  // 価格確認ボタン押下
  kakaku: 'kakaku',
  // 再計算ボタン押下
  cal: 'cal',
  // 実原材料追加ボタン押下
  add: 'add',
  // 値が変更され、かつフォーカスアウト
  onChange: 'onChange',
  //選択ボタン押下
  select: 'select',
  //コンボボックスの選択項目変更
  changeCombobox: 'changeCombobox',
  // 遷移イベント発生前処理
  jumpCheck: 'jumpCheck',
  //詳細画面データ検索イベント
  getDetail: 'getDetail',
  //確定ボタン押下
  confirm: 'confirm',
  //画面コントローラー状態の取得
  getCtrlStatus: 'getCtrlStatus',
  // シミュレーションボタン押下
  simulation: 'simulation',
  // ホームボタン押下
  home: 'home',
  // 採用ボタン押下
  saiyo: 'saiyo',
  // 一括削除ボタン押下
  iKatsuDel: 'iKatsuDel',
  //指定なしボタン押下
  siteiNasi: 'siteiNasi'
};
export function setRequestInfo(actionId: string, actionName: string) {
  _actionId = actionId;
  _actionName = actionName;
}
export function getActionId() {
  return _actionId;
}
export function getActionName() {
  return _actionName;
}
