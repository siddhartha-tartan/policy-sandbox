import { SimpleGrid } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useReducer } from "react";
import AppInputs from "../../../../components/forms/AppInputs";
import {
  FormTypes,
  IFormConfig,
} from "../../../../components/forms/utils/data";
import { formErrorsReducer } from "../../../../components/forms/utils/formErrorReducer";
import { formReducer } from "../../../../components/forms/utils/formReducer";
import { ILoanCategory } from "../../../../hooks/useGetLoanCategories";
import { userStore } from "../../../../store/userStore";
import { assesmentDataAtom, errorAtom } from "../atom";
import {
  ASSESMENT_DETAIL_FORM_KEYS,
  AssesmentFormValidators,
} from "../utils/validators";

const formConfig = (
  loanCategories: ILoanCategory[],
  assessmentId: string
): IFormConfig => ({
  title: "Loan Application",
  formFields: [
    {
      label: "Add Title",
      placeholder: "Enter Title",
      inputKey: ASSESMENT_DETAIL_FORM_KEYS.NAME,
      type: FormTypes.TEXT,
      required: true,
      validators: ASSESMENT_DETAIL_FORM_KEYS.NAME,
    },
    {
      label: "Select Product Category",
      placeholder: "Select Product Category",
      inputKey: ASSESMENT_DETAIL_FORM_KEYS.LOAN_CATEGORY,
      type: FormTypes.SELECT,
      disabled: !!assessmentId,
      required: true,
      options: loanCategories?.map((item) => ({
        label: item.category_type,
        value: item.id,
      })),
      validators: ASSESMENT_DETAIL_FORM_KEYS.LOAN_CATEGORY,
    },
    {
      label: "Add description",
      placeholder: "Enter Description",
      inputKey: ASSESMENT_DETAIL_FORM_KEYS.DESCRIPTION,
      type: FormTypes.TEXTAREA,
      required: false,
      className: "col-span-2",
    },
    {
      label: "Select Start Date & Time",
      placeholder: "Select Start date",
      inputKey: ASSESMENT_DETAIL_FORM_KEYS.START_DATE,
      type: FormTypes.DATETIME,
      required: true,
    },
    {
      label: "Select End Date & Time",
      placeholder: "Select End date",
      inputKey: ASSESMENT_DETAIL_FORM_KEYS.END_DATE,
      type: FormTypes.DATETIME,
      required: true,
    },
    {
      label: "Passing percentage",
      placeholder: "Enter Passing percentage",
      inputKey: ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE,
      type: FormTypes.NUMBER,
      required: true,
      validators: ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE,
    },
  ],
  ctaText: "Submit",
});
export default function DetailsTab() {
  const [assesmentData, setAssesmentData] = useAtom(assesmentDataAtom);
  const [errorData, setErrorData] = useAtom(errorAtom);
  const [state, dispatchValue] = useReducer(formReducer, assesmentData || {});
  const [errors, dispatchError] = useReducer(
    formErrorsReducer,
    errorData || {}
  );
  const { editableLoanCategories } = userStore();
  const onBlur = () => {
    const startDate = state[ASSESMENT_DETAIL_FORM_KEYS.START_DATE];
    const endDate = state[ASSESMENT_DETAIL_FORM_KEYS.END_DATE];
    if (startDate) {
      if (
        new Date(startDate) < new Date(new Date().getTime() - 1 * 60 * 1000)
      ) {
        dispatchError({
          inputKey: ASSESMENT_DETAIL_FORM_KEYS.START_DATE,
          error: "Invalid Start date",
        });
      } else {
        dispatchError({
          inputKey: ASSESMENT_DETAIL_FORM_KEYS.START_DATE,
          error: "",
        });
      }
    }
    if (startDate && endDate) {
      if (
        ["string", "number"].includes(typeof startDate) &&
        ["string", "number"].includes(typeof endDate)
      ) {
        if (new Date(endDate) <= new Date(startDate)) {
          dispatchError({
            inputKey: ASSESMENT_DETAIL_FORM_KEYS.END_DATE,
            error: "End Date must be greater than Start Date",
          });
        } else {
          dispatchError({
            inputKey: ASSESMENT_DETAIL_FORM_KEYS.END_DATE,
            error: "",
          });
        }
      }
    }
  };

  useEffect(() => {
    setAssesmentData(state);
    setErrorData(errors);
  }, [state, errors]);

  return (
    <SimpleGrid gap="24px" w={"full"}>
      <AppInputs
        formConfig={formConfig(editableLoanCategories, assesmentData?.id!)}
        formFields={
          formConfig(editableLoanCategories, assesmentData?.id!).formFields
        }
        formValue={state}
        formErrors={errors}
        formValidators={AssesmentFormValidators}
        dispatchValue={dispatchValue}
        dispatchError={dispatchError}
        onBlur={onBlur}
      />
    </SimpleGrid>
  );
}
