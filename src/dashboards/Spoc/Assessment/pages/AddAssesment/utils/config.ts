import {
  FormTypes,
  IFormConfig,
  TFormValidators,
} from "../../../../../../components/forms/utils/data";
import { IOption } from "../../IndivisualAssesment/hooks/useGetAssesment";

export const generateQuestionsFormValidators: TFormValidators = {
  no_of_questions: (value) => {
    if (!/^([5-9]|1[0-9]|2[0-5])$/.test(`${value}`)) {
      return "Number of Questions should range between 5 and 25";
    }
  },
};

export const generateQuestionsFormConfig: (
  options: IOption[]
) => IFormConfig = (options) => ({
  title: "",
  formFields: [
    {
      inputKey: "file_ids",
      label: "Select Policies",
      placeholder: "Select Policies",
      type: FormTypes.MULTI_SELECT,
      required: true,
      options: options,
      validators: undefined,
    },
    {
      inputKey: "no_of_questions",
      label: "Number of questions",
      placeholder: "Enter Number of Questions",
      type: FormTypes.NUMBER,
      required: true,
      validators: "no_of_questions",
    },
  ],
  ctaText: "",
});
