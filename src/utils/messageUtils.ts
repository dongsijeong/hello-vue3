const messageList: any[] = [];
const messageConfirmList: any[] = [];
const messageConfirmListSka: any[] = [];
const messageConfirmListSelect: any[] = [];
const showState = { showFlag: false, requestCount: 0 };
const confirmSkResult = {sKaChangeFlg: '0'};
export interface MessageType {
  type: string;
}

const messageType: MessageType = { type: '' };
const confirmType: MessageType = { type: '' };
export function getMessage(): any[] {
  return messageList;
}

export function setMessage(message: string) {
  messageList.push(message);
}

export function setMessageAndType(message: string, type: string) {
  messageType.type = type;
  messageList.push(message);
}

export function clearMessage() {
  messageConfirmList.splice(0);
  messageConfirmListSka.splice(0);
  return messageList.splice(0);
}

export function clearMessageSelect() {
  messageConfirmListSelect.splice(0);
  return messageList.splice(0);
}

export function getMessageType(): MessageType {
  return messageType;
}

export function setMessageType(type: any) {
  messageType.type = type;
}
export function getConfirmSkResult() {
  return confirmSkResult.sKaChangeFlg;
}

export function setConfirmSkResult(flg: string) {
  confirmSkResult.sKaChangeFlg = flg;
}

export function setConfirmTypeType(type: any) {
  confirmType.type = type;
}

export function getConfirmMessage(): any[] {
  return messageConfirmList;
}
export function getConfirmMessageSka(): any[] {
  return messageConfirmListSka;
}

export function getmessageConfirmListSelect(): any[] {
  return messageConfirmListSelect;
}

export function showLoadPage() {
  showState.requestCount++;
  showState.showFlag = true;
}
export function hiddenLoadPage() {
  setTimeout(() => {
    showState.requestCount--;
    if (showState.requestCount == 0) {
      showState.showFlag = false;
    }
  }, 500);
}

export function getShowFlag() {
  return showState;
}

export function setConfirmMessage(message: string) {
  // message = message.replaceAll('\n', '<br>');
  // messageConfirmList.push(message);
  let messageFmt = '';
  for (let index = 0; index < message.split('\n').length; index++) {
    messageFmt += message[index].replace('\n', '<br>');
  }
  messageConfirmList.push(messageFmt);
  return new Promise((resolve, reject) => {
    let begin = 0;
    begin = window.setInterval(() => {
      setTimeout(() => {
        if (confirmType.type == 'OK') {
          confirmType.type = '';
          clearInterval(begin);
          return resolve('resolve');
        } else if (confirmType.type == 'CANCEL') {
          confirmType.type = '';
          clearInterval(begin);
          return reject('reject');
        }
      }, 0);
    }, 1000);
  });
}

export function setConfirmMessageSka(message: string) {
  // message = message.replaceAll('\n', '<br>');
  // messageConfirmListSka.push(message);
  let messageFmt = '';
  for (let index = 0; index < message.split('\n').length; index++) {
    messageFmt += message[index].replace('\n', '<br>');
  }
  messageConfirmListSka.push(messageFmt);
  return new Promise((resolve, reject) => {
    let begin = 0;
    begin = window.setInterval(() => {
      setTimeout(() => {
        if (confirmType.type == 'OK') {
          confirmType.type = '';
          clearInterval(begin);
          return resolve('resolve');
        } else if (confirmType.type == 'CANCEL') {
          confirmType.type = '';
          clearInterval(begin);
          return reject('reject');
        }
      }, 0);
    }, 1000);
  });
}

export function setConfirmMessageSelect(message: string) {
  // message = message.replaceAll('\n', '<br>');
  // messageConfirmListSelect.push(message);
  let messageFmt = '';
  for (let index = 0; index < message.split('\n').length; index++) {
    messageFmt += message[index].replace('\n', '<br>');
  }
  messageConfirmListSelect.push(messageFmt);
  return new Promise((resolve, reject) => {
    let begin = 0;
    begin = window.setInterval(() => {
      setTimeout(() => {
        if (confirmType.type == 'OK') {
          confirmType.type = '';
          clearInterval(begin);
          return resolve('resolve');
        } else if (confirmType.type == 'CANCEL') {
          confirmType.type = '';
          clearInterval(begin);
          return reject('reject');
        }
      }, 0);
    }, 1000);
  });
}
