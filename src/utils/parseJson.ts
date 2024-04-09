/**
 * Jasonの値をFormDataの値で設置する
 * @param jsonObj
 * @param formData
 * @returns
 */
function setParseJsonItem(jsonObj: any, formData: any) {
  const formDataKeys = formData.constructor.keys(formData);
  for (const key in jsonObj) {
    if (jsonObj[key] === undefined) {
      continue;
    }

    if (jsonObj[key] != null && typeof jsonObj[key] == 'object') {
      setParseJsonItem(jsonObj[key], formData);
    } else {
      formDataKeys.forEach((formDataKeysElement: any) => {
        if (key === formDataKeysElement) {
          jsonObj[key] = formData[formDataKeysElement].value;
        }
      });
    }
  }
  return jsonObj;
}
/**
 * FormDataの値をJasonの値で設置する
 * @param jsonObj
 * @param formData
 * @returns
 */
function setFormDataItem(jsonObj: any, formData: any) {
  const formDataKeys = formData.constructor.keys(formData);
  for (const key in jsonObj) {
    if (jsonObj[key] != null && typeof jsonObj[key] == 'object') {
      setFormDataItem(jsonObj[key], formData);
    } else {
      formDataKeys.forEach((formDataKeysElement: any) => {
        if (key === formDataKeysElement) {
          formData[formDataKeysElement].value = jsonObj[key];
        }
      });
    }
  }
  return formData;
}

/**
 * Jasonの値をFormDataの値で設置する
 * @param jsonObj
 * @param formData
 * @returns
 */
function setParseJsonItemSamePath(jsonObj: any, formData: any, beforePath?: string) {
  if (formData == null) {
    return;
  }
  if (beforePath && formData[beforePath] == null) {
    return;
  }
  if (beforePath) {
    formData = formData[beforePath];
  }
  const formDataKeys = formData.constructor.keys(formData);
  for (const key in jsonObj) {
    if (jsonObj[key] === undefined) {
      continue;
    }
    if (jsonObj[key] != null && typeof jsonObj[key] == 'object') {
      setParseJsonItemSamePath(jsonObj[key], formData, key);
    } else {
      formDataKeys.forEach((formDataKeysElement: any) => {
        if (key === formDataKeysElement) {
          jsonObj[key] = formData[formDataKeysElement].value;
        }
      });
    }
  }
  return jsonObj;
}
/**
 * FormDataの値をJasonの値で設置する
 * @param jsonObj
 * @param formData
 * @returns
 */
function setFormDataItemSamePath(jsonObj: any, formData: any, beforePath?: string) {
  if (formData == null) {
    return;
  }
  if (beforePath && formData[beforePath] == null) {
    return;
  }
  if (beforePath) {
    formData = formData[beforePath];
  }

  const formDataKeys = formData.constructor.keys(formData);
  for (const key in jsonObj) {
    if (jsonObj[key] != null && typeof jsonObj[key] == 'object') {
      setFormDataItemSamePath(jsonObj[key], formData, key);
    } else {
      formDataKeys.forEach((formDataKeysElement: any) => {
        if (key === formDataKeysElement) {
          formData[formDataKeysElement].value = jsonObj[key];
        }
      });
    }
  }
  return formData;
}

export default {
  setParseJsonItem,
  setFormDataItem,
  setParseJsonItemSamePath,
  setFormDataItemSamePath
};
