import { ChangeEvent, forwardRef, useCallback } from "react";
import CustomInputLabel from "./CustomInputLabel";
import { InputFieldsProps } from "./utils/data";

const CustomTextInput = forwardRef((props: InputFieldsProps, ref) => {
  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = props?.upperCase
      ? e.target.value.toUpperCase()
      : e.target.value;

    props.onInput({ value, inputKey: props.inputKey });
  }, []);

  const handleChange = (e: any) => {
    e.preventDefault();
  };

  return (
    <CustomInputLabel
      value={props.value || ""}
      tooltip={props.tooltip || ""}
      onChange={handleOnChange}
      label={props.label}
      ref={ref}
      required={props?.required}
      isReadOnly={props?.disabled}
      placeholder={props.placeholder}
      error={props?.errorMsg}
      onBlur={(e: ChangeEvent<HTMLInputElement>) => {
        const value = props?.upperCase
          ? e.target.value.toUpperCase()
          : e.target.value;
        props.onBlur({ value, inputKey: props.inputKey });
      }}
      formStyle={props.formStyle}
      className={props?.className}
      transform={props?.upperCase ? "uppercase" : "none"}
      {...(props?.disableCache && {
        autoComplete: "off",
        onCut: handleChange,
        onCopy: handleChange,
        onPaste: handleChange,
      })}
    />
  );
});

export default CustomTextInput;
