import {
  getNestedValue,
  isNullOrUndefined,
} from "../../../utils/helpers/isNullorUndefined";
import { IFormFields } from "./data";

function checkForRequiredFields(
  formFields: IFormFields[],
  formState: Record<string, any>
): boolean {
  if (!formFields) return false;
  for (const item of formFields) {
    const value = getNestedValue(formState, item.inputKey);

    if (
      item.required &&
      (isNullOrUndefined(value) ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length < 1))
    ) {
      return true;
    }

    if (item.subfields) {
      const ans = checkForRequiredFields(
        item?.subfields?.[value] || [],
        formState
      );
      if (ans) return ans;
    }
  }
  return false;
}

function hasErrors(obj: Record<string, any>): boolean {
  return Object.values(obj).some((val) => {
    if (val && typeof val === "object") {
      return hasErrors(val);
    }
    return !!val;
  });
}

export function checkFormValidity(
  formErrors: Record<string, any>,
  formFields: Array<IFormFields>,
  formState: Record<string, any>
): boolean {
  const anyError = hasErrors(formErrors);
  if (anyError) {
    return true;
  }
  return checkForRequiredFields(formFields, formState);
}
