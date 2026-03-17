import { IFormConfig, IFormFields } from "./data";

export function getFieldConfigForInput(
  formConfig: IFormConfig,
  inputKey: string
): IFormFields | undefined {
  let fieldConfig = undefined;
  fieldConfig = formConfig.formFields.find(
    (field) => field.inputKey === inputKey
  );

  if (fieldConfig) return fieldConfig;

  if (!fieldConfig && formConfig.formFields.some((field) => field.subfields)) {
    formConfig.formFields.forEach((field) => {
      if (field?.subfields) {
        const subFieldSet = new Set<IFormFields>();
        Object.values(field.subfields).forEach((subfield) => {
          subfield.forEach((item) => subFieldSet.add(item));
        });
        for (const item of subFieldSet.values()) {
          if (item.inputKey === inputKey) {
            fieldConfig = item;
            break;
          }
        }
      }
    });
  }
  return fieldConfig;
}
