import { FormTypes } from "../../../../../forms/utils/data";

export const UserStatusField = {
  inputKey: "is_active",
  label: "Status",
  placeholder: "User Status",
  type: FormTypes.CHECKBOX,
  required: true,
  validators: undefined,
  valueMapper: { true: "Active", false: "Not Active" },
};

export const queryPermissionField = {
  inputKey: "query_permission",
  label: "Can ask queries?",
  placeholder: "Can ask queries?",
  type: FormTypes.CHECKBOX,
  required: true,
  validators: undefined,
  valueMapper: { true: "Yes", false: "No" },
};
