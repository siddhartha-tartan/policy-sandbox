import React, { forwardRef } from "react";
import CustomInputLabel from "./CustomInputLabel";
import { FormTypes, InputFieldsProps } from "./utils/data";

const getPhoneMaxLength = (value: string | number) => {
  const strVal = String(value || "");
  if (strVal.startsWith("91")) return 12;
  if (strVal.startsWith("+")) return 13;
  if (strVal.startsWith("0")) return 11;
  return 10;
};

const CustomMobileNumberInput = forwardRef((props: InputFieldsProps, ref) => {
  const maxLength = getPhoneMaxLength(props.value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/(?!^\+)\D/g, "");

    if (val.length > maxLength) {
      val = val.slice(0, maxLength);
    }

    props.onInput({ value: val, inputKey: props.inputKey });
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onBlur) {
      props.onBlur({ value: e.target.value, inputKey: props.inputKey });
    }
  };

  return (
    <CustomInputLabel
      value={props.value || ""}
      placeholder={props.placeholder}
      onChange={handleOnChange}
      className={props?.className}
      label={props.label}
      ref={ref}
      required={props?.required}
      isReadOnly={props?.disabled}
      type={FormTypes.MOBILE_NUMBER}
      error={props?.errorMsg}
      formStyle={props.formStyle}
      onBlur={handleOnBlur}
      onKeyDown={handleOnKeyDown}
    />
  );
});

export default CustomMobileNumberInput;
