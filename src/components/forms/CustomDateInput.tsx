import { ChangeEvent, forwardRef, useCallback, useState } from "react";
import { FormTypes, InputFieldsProps } from "./utils/data";
import CustomInputLabel from "./CustomInputLabel";

const CustomDateInput = forwardRef((props: InputFieldsProps, ref) => {
  const handleOnChange = useCallback((e: any) => {
    const value = e.target.value;
    props.onInput({ value, inputKey: props.inputKey });
  }, []);
  const [inputType, setInputType] = useState(FormTypes.TEXT);

  return (
    <CustomInputLabel
      value={props.value}
      label={props.label}
      placeholder={props.placeholder}
      ref={ref}
      onChange={handleOnChange}
      isReadOnly={props?.disabled || false}
      error={props?.errorMsg || ""}
      required={props?.required || false}
      type={inputType}
      onFocus={() => {
        setInputType(FormTypes.DATE);
      }}
      onBlur={(e: ChangeEvent<HTMLInputElement>) => {
        if (!props.value) setInputType(FormTypes.TEXT);
        props.onBlur({ value: e.target.value, inputKey: props.inputKey });
      }}
    />
  );
});

export default CustomDateInput;
