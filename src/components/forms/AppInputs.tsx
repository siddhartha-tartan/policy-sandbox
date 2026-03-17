import React, { useCallback } from "react";
import { getNestedValue } from "../../utils/helpers/isNullorUndefined";
import CustomDateInput from "./CustomDateInput";
import CustomDateTimeInput from "./CustomDateTimeInput";
import CustomFileInput from "./CustomFileInput";
import CustomMobileNumberInput from "./CustomMobileNumberInput";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomNumberInput from "./CustomNumberInput";
import CustomPasswordInput from "./CustomPasswordInput";
import CustomSelectInput from "./CustomSelectInput";
import CustomSliderInput from "./CustomSliderInput";
import CustomCheckboxInput from "./CustomCheckboxInput";
import CustomTextareaInput from "./CustomTextareaInput";
import CustomTextInput from "./CustomTextInput";
import CustomToggleInput from "./CustomToggleInput";
import { FormTypes, IAppInputProps } from "./utils/data";
import { getFieldConfigForInput } from "./utils/getFieldConfigForInput";
import { GridItem } from "@chakra-ui/react";

const AppInputs = ({
  formConfig,
  formFields,
  formValue,
  formErrors = {},
  formValidators,
  dispatchValue,
  dispatchError = () => {},
  onInput = () => {},
  formStyle = {},
  onBlur = () => {},
  isDisabled = false,
}: IAppInputProps) => {
  const handleInput = useCallback(
    ({ value, inputKey }: { value: any; inputKey: string }) => {
      if (inputKey) {
        dispatchValue({
          inputKey,
          value,
        });
        onInput({ inputKey, value });
        dispatchError({
          inputKey,
          error: "",
        });
      }
    },
    [formValue],
  );

  const handleBlur = useCallback(
    ({ value, inputKey }: { value: any; inputKey: string }) => {
      if (!inputKey) return;

      const fieldConfig = getFieldConfigForInput(formConfig, inputKey);

      let errorMsg = "";

      if (fieldConfig && value) {
        // ✅ Check single validator first
        if (
          fieldConfig.validators &&
          formValidators?.[fieldConfig.validators]
        ) {
          const validatorFn = formValidators[fieldConfig.validators];
          if (validatorFn) {
            errorMsg = validatorFn(value) || "";
          }
        }

        // ✅ If no error, check multiple validators
        if (!errorMsg && fieldConfig.multipleValidators?.length) {
          for (const validator of fieldConfig.multipleValidators) {
            if (formValidators?.[validator]) {
              const validatorFn = formValidators[validator];
              if (validatorFn) {
                errorMsg = validatorFn(value) || "";
                if (errorMsg) break;
              }
            }
          }
        }
      }

      dispatchError({
        inputKey,
        error: errorMsg,
      });

      onBlur({ inputKey, value });
    },
    [formConfig, formValidators, dispatchError, onBlur],
  );

  return formFields?.map((fieldConfig) => {
    // 2. getNestedValue will now work if formState is nested (e.g., orchestrator_llm: { provider: '...' })
    const value = getNestedValue(formValue, fieldConfig.inputKey, "");
    const errorMsg = getNestedValue(formErrors, fieldConfig.inputKey, "");

    const inputProps = {
      onInput: handleInput,
      onBlur: handleBlur,
      value: value,
      disabled: isDisabled || fieldConfig?.disabled,
      errorMsg: errorMsg,
      formStyle: formStyle,
      className: fieldConfig?.className || "",
      ...fieldConfig,
    };

    // 3. Helper function to keep the JSX clean
    const renderComponent = () => {
      if (fieldConfig.type === FormTypes.SELECT) {
        return (
          <React.Fragment>
            <CustomSelectInput
              key={fieldConfig.inputKey + "select"}
              {...inputProps}
            />
            {fieldConfig.subfields && fieldConfig.subfields[value] && (
              <AppInputs
                formConfig={formConfig}
                formFields={fieldConfig.subfields[value]}
                formValue={formValue}
                formValidators={formValidators}
                formErrors={formErrors}
                dispatchValue={dispatchValue}
                dispatchError={dispatchError}
                onInput={onInput}
              />
            )}
          </React.Fragment>
        );
      }

      if ((fieldConfig.type as FormTypes) === FormTypes.PASSWORD) {
        return (
          <CustomPasswordInput
            key={fieldConfig?.inputKey + "pwd"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.MULTI_SELECT) {
        return (
          <CustomMultiSelect
            key={fieldConfig?.inputKey + "multi"}
            {...inputProps}
          />
        );
      }

      if ((fieldConfig.type as FormTypes) === FormTypes.CHECKBOX) {
        return (
          <CustomToggleInput
            key={fieldConfig?.inputKey + "check"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.DATE) {
        return (
          <CustomDateInput
            key={fieldConfig?.inputKey + "date"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.DATETIME) {
        return (
          <CustomDateTimeInput
            key={fieldConfig?.inputKey + "time"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.FILE) {
        return (
          <CustomFileInput
            key={fieldConfig?.inputKey + "file"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.TEXTAREA) {
        return (
          <CustomTextareaInput
            key={fieldConfig?.inputKey + "txtarea"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.NUMBER) {
        return (
          <CustomNumberInput
            key={fieldConfig?.inputKey + "num"}
            {...inputProps}
          />
        );
      }

      if (fieldConfig.type === FormTypes.MOBILE_NUMBER) {
        return (
          <CustomMobileNumberInput
            key={fieldConfig?.inputKey + "mobile-num"}
            {...inputProps}
          />
        );
      }

      if ((fieldConfig.type as FormTypes) === FormTypes.SWITCH) {
        return (
          <CustomCheckboxInput
            key={fieldConfig?.inputKey + "switch"}
            variant="switch"
            {...inputProps}
          />
        );
      }

      if ((fieldConfig.type as FormTypes) === FormTypes.SLIDER) {
        return (
          <CustomSliderInput
            key={fieldConfig?.inputKey + "slider"}
            {...inputProps}
          />
        );
      }

      return (
        <React.Fragment>
          <CustomTextInput
            key={fieldConfig?.inputKey + "txt"}
            {...inputProps}
          />
          {fieldConfig.subfields && fieldConfig.subfields[value] && (
            <AppInputs
              key={`subfields${fieldConfig?.inputKey}`}
              formConfig={formConfig}
              formFields={fieldConfig.subfields[value]}
              formValue={formValue}
              formValidators={formValidators}
              formErrors={formErrors}
              dispatchValue={dispatchValue}
              dispatchError={dispatchError}
              onInput={onInput}
              isDisabled={isDisabled}
            />
          )}
        </React.Fragment>
      );
    };

    // 4. Wrap the result in GridItem to support colSpan
    return (
      <GridItem key={fieldConfig.inputKey} colSpan={fieldConfig.colSpan || 1}>
        {renderComponent()}
      </GridItem>
    );
  });
};

export default AppInputs;
