export interface GamenModeItem {
  gamenModeId: string;
  gamenModeName: string;
  gamenReturnControl: boolean;
}

function gamenModeItem(gamenModeId: string, gamenModeName: string, gamenReturnControl: boolean): GamenModeItem {
  return {
    gamenModeId,
    gamenModeName,
    gamenReturnControl
  };
}

export const gamenModeNameDefs = [
  gamenModeItem('VIEW', '[照会]', false),
  gamenModeItem('NEW', '[新規登録]', true),
  gamenModeItem('NEWCREAT', '[新規作成]', true),
  gamenModeItem('NEWFOOD', '[食材新規登録]', true),
  gamenModeItem('ASSUM', '[仮食材新規登録]', true),
  gamenModeItem('REPLACE', '', true),
  gamenModeItem('MODIFY', '[変更]', true),
  gamenModeItem('DELETE', '[削除]', false),
  gamenModeItem('ADMIT', '[承認]', false),
  gamenModeItem('DEL_CANCEL', '[削除取消]', false),
  gamenModeItem('COPY', '[コピー作成]', true),
  gamenModeItem('NEWMOD', '[登録/変更]', true),
  gamenModeItem('COPY_REG', '[コピー登録]', true),
  gamenModeItem('ADD', '[商品追加]', true),
  gamenModeItem('NEXT', '[次期追加]', true),
  gamenModeItem('NEWNEXT', '[新規次期商品]', true),
  gamenModeItem('NEWMOD_WITHOUT_MSG', '[登録/変更]', false),
  gamenModeItem('ADMIT_WITH_MSG', '', true),
  gamenModeItem('NEW_PACKING_MATERIAL', '[包材新規登録]', true)
];
