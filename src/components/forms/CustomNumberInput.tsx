import { ChangeEvent, forwardRef, useCallback } from "react";
import CustomInputLabel from "./CustomInputLabel";
import { FormTypes, InputFieldsProps } from "./utils/data";

const CustomNumberInput = forwardRef((props: InputFieldsProps, ref) => {
  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    props.onInput({ value, inputKey: props.inputKey });
  }, []);

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
      type={FormTypes.NUMBER}
      error={props?.errorMsg}
      formStyle={props.formStyle}
      onBlur={(e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        props.onBlur({ value, inputKey: props.inputKey });
      }}
    />
  );
});

export default CustomNumberInput;
