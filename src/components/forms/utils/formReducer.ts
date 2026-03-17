import { TFormActionType, TInitFormActionType } from "./data";
import { isFormInitActionType } from "./isFormInitActionType";

const setPathSafe = (obj: any, path: string, value: any) => {
  if (!path.includes(".")) {
    obj[path] = value;
    return obj;
  }

  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
};

export const formReducer = (
  state: any,
  action: TFormActionType | TInitFormActionType,
) => {
  if (isFormInitActionType(action)) {
    return {
      ...state,
      ...action.initialValues,
    };
  }

  const newState = { ...state };
  return setPathSafe(newState, action.inputKey, action.value);
};
