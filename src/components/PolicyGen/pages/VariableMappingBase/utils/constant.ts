import { CSV_COLUMN_MAPPING } from "../../../../../utils/constants/interfaces";
import { isNullOrUndefined } from "../../../../../utils/helpers/isNullorUndefined";

export type variableMappingTab = "mapped" | "unmapped";
export const VARIABLE_MAPPING_TABS: {
  MAPPED: variableMappingTab;
  UNMAPPED: variableMappingTab;
} = {
  MAPPED: "mapped",
  UNMAPPED: "unmapped",
};

export const dataTypes = ["Integer", "Char", "Boolean", "Date", "String"];

export const VariableMappingCsvColumns: CSV_COLUMN_MAPPING[] = [
  {
    columnName: "Type",
    jsonFieldName: "data_type",
    required: true,
    acceptedvalues: dataTypes,
  },
  {
    columnName: "Variable Name (Case sensitive)",
    jsonFieldName: "destination_variable",
    required: true,
    pattern: /^\w+$/,
  },
  {
    columnName: "Description",
    jsonFieldName: "description",
    required: false,
  },
];

export const validateCsvData = (
  data: any,
  columns: CSV_COLUMN_MAPPING[]
): boolean => {
  let hasError = false;
  columns?.map((item) => {
    const fieldValue = data?.[item?.jsonFieldName];
    if (item.required) {
      if (isNullOrUndefined(fieldValue) || fieldValue === "") {
        hasError = true;
      }
    }
    if (item?.acceptedvalues && item.acceptedvalues?.length > 0) {
      if (!item.acceptedvalues.includes(fieldValue?.replace(/\s+/g, ""))) {
        hasError = true;
      }
    }
  });
  return hasError;
};
