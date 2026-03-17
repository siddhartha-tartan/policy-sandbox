import { ILoanCategory } from "../../../../../../hooks/useGetLoanCategories";
import { regexMobileNumber } from "../../../../../../utils/common/regex";
import {
  FeatureIdentifiers,
  UserType,
} from "../../../../../../utils/constants/constants";
import { CSV_COLUMN_MAPPING } from "../../../../../../utils/constants/interfaces";
import { parseCsvToJson } from "../../../../../../utils/helpers/csvtojson";

export const ADD_USER_COLUMN_MAPPING: CSV_COLUMN_MAPPING[] = [
  {
    columnName: "Employee ID (Mandatory)",
    jsonFieldName: "source_employee_id",
    required: true,
    dataType: "string",
  },
  {
    columnName: "Name (Mandatory)",
    jsonFieldName: "name",
    required: true,
    dataType: "string",
  },
  {
    columnName: "Mobile (Mandatory)",
    jsonFieldName: "phone_number",
    required: true,
    pattern: regexMobileNumber,
    dataType: "string",
  },
  {
    columnName: "Email (Mandatory)",
    jsonFieldName: "email",
    required: true,
    dataType: "string",
  },
  {
    columnName: "Role (Mandatory)",
    jsonFieldName: "user_type",
    required: true,
    dataType: "string",
    acceptedvalues: [
      "policymanager",
      "user",
      "queryuser",
      "querystaffuser",
      "staffuser",
      "assessmentmanager",
    ],
  },
  {
    columnName: "Product Category (Mandatory)",
    jsonFieldName: "loan_category_name",
    required: true,
    dataType: "string",
  },
  {
    columnName: "PolyGPT",
    jsonFieldName: FeatureIdentifiers.POLYGPT,
    required: true,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
  {
    columnName: "AI Assessments",
    jsonFieldName: FeatureIdentifiers.AI_ASSESSMENT,
    required: true,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
  {
    columnName: "Compare",
    jsonFieldName: FeatureIdentifiers.POLICY_COMPARISON,
    required: true,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
];

export const EDIT_USER_COLUMN_MAPPING: CSV_COLUMN_MAPPING[] = [
  {
    columnName: "Employee ID (Mandatory)",
    jsonFieldName: "source_employee_id",
    required: false,
    dataType: "string",
  },
  {
    columnName: "Name (Mandatory)",
    jsonFieldName: "name",
    required: false,
    dataType: "string",
  },
  {
    columnName: "Mobile (Mandatory)",
    jsonFieldName: "phone_number",
    required: false,
    pattern: regexMobileNumber,
    dataType: "string",
  },
  {
    columnName: "Email (Mandatory)",
    jsonFieldName: "email",
    required: true,
    dataType: "string",
  },
  {
    columnName: "Role (Mandatory)",
    jsonFieldName: "user_type",
    required: false,
    dataType: "string",
    acceptedvalues: [
      "policymanager",
      "user",
      "queryuser",
      "querystaffuser",
      "staffuser",
      "assessmentmanager",
    ],
  },
  {
    columnName: "Product Category (Mandatory)",
    jsonFieldName: "loan_category_name",
    required: false,
    dataType: "string",
  },
  {
    columnName: "PolyGPT",
    jsonFieldName: FeatureIdentifiers.POLYGPT,
    required: false,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
  {
    columnName: "AI Assessments",
    jsonFieldName: FeatureIdentifiers.AI_ASSESSMENT,
    required: false,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
  {
    columnName: "Compare",
    jsonFieldName: FeatureIdentifiers.POLICY_COMPARISON,
    required: false,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
  {
    columnName: "Is_Active",
    jsonFieldName: "is_active",
    required: false,
    dataType: "boolean",
    acceptedvalues: ["true", "false"],
  },
];

// Map role values to UserType enum
export const roleValueMapper = {
  policymanager: UserType.SPOC,
  user: UserType.STAFF_USER,
  staffuser: UserType.STAFF_USER,
  queryuser: UserType.QUERY_STAFF_USER,
  querystaffuser: UserType.QUERY_STAFF_USER,
  assessmentmanager: UserType.ASSESSMENT_MANAGER,
};

// Helper function to convert value to the specified data type
function convertToDataType(value: any, dataType: string): any {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  switch (dataType) {
    case "string":
      return String(value);
    case "boolean":
      if (typeof value === "string") {
        const normalized = value.toLowerCase().trim();
        return (
          normalized === "true" || normalized === "1" || normalized === "yes"
        );
      }
      return Boolean(value);
    case "number":
    case "integer":
      return Number(value);
    default:
      return value;
  }
}

export async function validateUploadedCSV(
  file: File,
  loanCategories: ILoanCategory[]
): Promise<{ data?: any[]; error?: string }> {
  try {
    // Parse CSV to JSON
    const parsedData = await parseCsvToJson(file, ADD_USER_COLUMN_MAPPING);

    // Check if data is empty
    if (!parsedData || parsedData.length === 0) {
      return { error: "No data found in the CSV file or file is empty." };
    }

    // Validate each row
    const validatedData = [];

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const rowNumber = i + 2; // +2 because of header row and 0-indexing
      const validatedRow = { ...row };

      // Validate each field based on column mapping
      for (const column of ADD_USER_COLUMN_MAPPING) {
        const {
          columnName,
          jsonFieldName,
          required,
          acceptedvalues,
          dataType,
        } = column;
        const fieldValue = row[jsonFieldName];

        if (
          required &&
          (fieldValue === null ||
            fieldValue === undefined ||
            fieldValue.toString().trim() === "")
        ) {
          return {
            error: `Row ${rowNumber}: Missing required value for "${columnName}"`,
          };
        }

        if (fieldValue !== null && fieldValue !== undefined) {
          // Convert value to the specified data type
          const typedValue = dataType
            ? convertToDataType(fieldValue, dataType)
            : fieldValue;
          validatedRow[jsonFieldName] = typedValue;

          if (acceptedvalues) {
            // For string validation
            if (dataType === "string") {
              // Convert to lowercase and remove spaces for comparison
              const normalizedValue = fieldValue
                .toString()
                .toLowerCase()
                .replace(/\s+/g, "");

              if (
                !acceptedvalues
                  .map((v) => v.toString().toLowerCase().replace(/\s+/g, ""))
                  .includes(normalizedValue)
              ) {
                return {
                  error: `Row ${rowNumber}: Invalid value "${fieldValue}" for "${columnName}". Accepted values are: ${acceptedvalues.join(
                    ", "
                  )}`,
                };
              }
            }
            // For boolean and number validation
            else if (
              (dataType === "boolean" ||
                dataType === "number" ||
                dataType === "integer") &&
              !acceptedvalues
                .map((v) => convertToDataType(v, dataType))
                .includes(typedValue)
            ) {
              return {
                error: `Row ${rowNumber}: Invalid value "${fieldValue}" for "${columnName}". Accepted values are: ${acceptedvalues.join(
                  ", "
                )}`,
              };
            }
          }
        }

        // Handle role mapping
        if (jsonFieldName === "user_type" && fieldValue) {
          const normalizedRole = fieldValue
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "");
          if (normalizedRole in roleValueMapper) {
            validatedRow[jsonFieldName] =
              roleValueMapper[normalizedRole as keyof typeof roleValueMapper];
          }
        }

        // Validate loan_category_name and append loan_category_id
        if (jsonFieldName === "loan_category_name" && fieldValue) {
          // Split by comma and trim each value
          const categoryNames = fieldValue
            .toString()
            .split(",")
            .map((name: string) => name.trim());
          const categoryIds: Set<string> = new Set<string>();

          for (const categoryName of categoryNames) {
            const normalizedCategoryName = categoryName
              .toLowerCase()
              .replace(/\s+/g, "");

            const matchedCategory = loanCategories.find(
              (category) =>
                category.category_type.toLowerCase().replace(/\s+/g, "") ===
                normalizedCategoryName
            );

            if (!matchedCategory) {
              return {
                error: `Row ${rowNumber}: Product Category "${categoryName}" does not exist in the system.`,
              };
            }

            // Add category ID to the set
            categoryIds.add(matchedCategory.id);
          }

          // Add loan_category_id as a set of IDs
          validatedRow.loan_category_id = categoryIds;
        }
      }

      validatedData.push(validatedRow);
    }

    // Check if validated data is empty
    if (validatedData.length === 0) {
      return { error: "No valid records found in the CSV file." };
    }

    return { data: validatedData };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while processing the CSV file",
    };
  }
}

export async function validateUploadedEditCsv(
  file: File,
  loanCategories: ILoanCategory[]
): Promise<{ data?: any[]; error?: string }> {
  try {
    // Parse CSV to JSON
    const parsedData = await parseCsvToJson(file, EDIT_USER_COLUMN_MAPPING);

    // Check if data is empty
    if (!parsedData || parsedData.length === 0) {
      return { error: "No data found in the CSV file or file is empty." };
    }

    // Validate each row
    const validatedData = [];

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const rowNumber = i + 2; // +2 because of header row and 0-indexing
      const validatedRow: any = {};

      // Validate each field based on EDIT_USER_COLUMN_MAPPING
      for (const column of EDIT_USER_COLUMN_MAPPING) {
        const {
          columnName,
          jsonFieldName,
          required,
          acceptedvalues,
          dataType,
          pattern,
        } = column;
        const fieldValue = row[jsonFieldName];

        // Check if field has a value (not null, undefined, or empty string)
        const hasValue =
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldValue.toString().trim() !== "";

        // Check required fields
        if (required && !hasValue) {
          return {
            error: `Row ${rowNumber}: Missing required value for "${columnName}"`,
          };
        }

        // Only process and include fields that have values
        if (hasValue) {
          // Convert value to the specified data type
          const typedValue = dataType
            ? convertToDataType(fieldValue, dataType)
            : fieldValue;

          // Validate pattern (for mobile number) - only if value exists and is not null
          if (
            pattern &&
            typedValue !== null &&
            !pattern.test(fieldValue.toString())
          ) {
            return {
              error: `Row ${rowNumber}: Field '${columnName}' does not have data in correct format: "${fieldValue}"`,
            };
          }

          // Validate accepted values
          if (acceptedvalues) {
            // For string validation
            if (dataType === "string") {
              // Convert to lowercase and remove spaces for comparison
              const normalizedValue = fieldValue
                .toString()
                .toLowerCase()
                .replace(/\s+/g, "");

              if (
                !acceptedvalues
                  .map((v) => v.toString().toLowerCase().replace(/\s+/g, ""))
                  .includes(normalizedValue)
              ) {
                return {
                  error: `Row ${rowNumber}: Invalid value "${fieldValue}" for "${columnName}". Accepted values are: ${acceptedvalues.join(
                    ", "
                  )}`,
                };
              }
            }
            // For boolean and number validation
            else if (
              (dataType === "boolean" ||
                dataType === "number" ||
                dataType === "integer") &&
              !acceptedvalues
                .map((v) => convertToDataType(v, dataType))
                .includes(typedValue)
            ) {
              return {
                error: `Row ${rowNumber}: Invalid value "${fieldValue}" for "${columnName}". Accepted values are: ${acceptedvalues.join(
                  ", "
                )}`,
              };
            }
          }

          // Handle role mapping
          if (jsonFieldName === "user_type") {
            const normalizedRole = fieldValue
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "");
            if (normalizedRole in roleValueMapper) {
              validatedRow[jsonFieldName] =
                roleValueMapper[normalizedRole as keyof typeof roleValueMapper];
            } else {
              validatedRow[jsonFieldName] = typedValue;
            }
          }
          // Validate loan_category_name and append loan_category_id
          else if (jsonFieldName === "loan_category_name") {
            // Split by comma and trim each value
            const categoryNames = fieldValue
              .toString()
              .split(",")
              .map((name: string) => name.trim());
            const categoryIds: Set<string> = new Set<string>();

            for (const categoryName of categoryNames) {
              const normalizedCategoryName = categoryName
                .toLowerCase()
                .replace(/\s+/g, "");

              const matchedCategory = loanCategories.find(
                (category) =>
                  category.category_type.toLowerCase().replace(/\s+/g, "") ===
                  normalizedCategoryName
              );

              if (!matchedCategory) {
                return {
                  error: `Row ${rowNumber}: Product Category "${categoryName}" does not exist in the system.`,
                };
              }

              // Add category ID to the set
              categoryIds.add(matchedCategory.id);
            }

            // Add both category name and IDs to validated row
            validatedRow[jsonFieldName] = typedValue;
            validatedRow.loan_category_id = categoryIds;
          } else {
            // For all other fields, just add the typed value
            validatedRow[jsonFieldName] = typedValue;
          }
        }
      }

      // Only add row to validatedData if it has at least one field with value
      if (Object.keys(validatedRow).length > 0) {
        validatedData.push(validatedRow);
      }
    }

    // Check if validated data is empty
    if (validatedData.length === 0) {
      return { error: "No valid records found in the CSV file." };
    }

    return { data: validatedData };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while processing the CSV file",
    };
  }
}
