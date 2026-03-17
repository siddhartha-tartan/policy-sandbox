import {
  FormTypes,
  IFormFields,
  TFormValidators,
} from "../../../../forms/utils/data";

export enum InviteCustomerFieldsEnum {
  BORROWER_PAN = "Age_Borrower",
  CO_BORROWER_PAN = "Age_CoBorrower",
  GST = "GST",
}

export const regexPanNumber = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const regexGstNumber =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const InviteCustomerFields: Record<
  InviteCustomerFieldsEnum,
  IFormFields
> = {
  [InviteCustomerFieldsEnum.BORROWER_PAN]: {
    inputKey: "borrower_pan",
    label: "Borrower PAN",
    placeholder: "Enter Borrower PAN",
    type: FormTypes.TEXT,
    required: true,
    validators: "pan",
    upperCase: true,
  },
  [InviteCustomerFieldsEnum.CO_BORROWER_PAN]: {
    inputKey: "co_borrower_pan",
    label: "Co-Borrower PAN",
    placeholder: "Enter Co-Borrower PAN",
    type: FormTypes.TEXT,
    required: true,
    validators: "pan",
    upperCase: true,
  },
  [InviteCustomerFieldsEnum.GST]: {
    inputKey: "gst",
    label: "Business GST Number",
    placeholder: "Enter Business GST Number",
    type: FormTypes.TEXT,
    required: true,
    validators: "gst",
    upperCase: true,
  },
};

export const InviteCustomerValidators: TFormValidators = {
  pan: (value) => {
    if (!regexPanNumber.test(`${value}`)) {
      return "Invalid PAN Number";
    }
  },
  gst: (value) => {
    if (!regexGstNumber.test(`${value}`)) {
      return "Invalid GST Number";
    }
  },
};
