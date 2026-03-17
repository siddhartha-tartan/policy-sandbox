import { TFormValidators } from "../../../../components/forms/utils/data";

export const ASSESMENT_DETAIL_FORM_KEYS = {
  NAME: "name",
  LOAN_CATEGORY: "loanCategory",
  DESCRIPTION: "description",
  START_DATE: "start_date",
  END_DATE: "end_date",
  PASSING_SCORE: "passing_score",
};

export const AssesmentFormValidators: TFormValidators = {
  [ASSESMENT_DETAIL_FORM_KEYS.NAME]: (value) => {
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      return "Title is required";
    }
  },
  [ASSESMENT_DETAIL_FORM_KEYS.LOAN_CATEGORY]: (value) => {
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      return "Product Category is required";
    }
  },
  [ASSESMENT_DETAIL_FORM_KEYS.PASSING_SCORE]: (value) => {
    const score = Number(value);
    if (isNaN(score) || score < 1 || score > 100) {
      return "Passing percentage must be between 1 and 100";
    }
  },
};
