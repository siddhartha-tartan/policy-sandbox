import Papa, { ParseStepResult } from "papaparse";
import { CSV_COLUMN_MAPPING } from "../constants/interfaces";

interface CSV_ROW {
  [key: string]: string;
}

/**
 * Process a single row from the CSV data
 */
const processRow = (
  row: CSV_ROW,
  columnMappings: CSV_COLUMN_MAPPING[],
  onError: (error: Error) => void
): CSV_ROW | null => {
  const filteredRow: CSV_ROW = {};

  for (const columnMapping of columnMappings) {
    const { columnName, jsonFieldName, required, pattern } = columnMapping;

    if (!row.hasOwnProperty(columnName)) {
      if (required) {
        onError(
          new Error(`Required field '${columnName}' not found in the CSV data.`)
        );
        return null;
      }
      continue;
    }

    // Only validate pattern if the field has a value (not empty)
    if (
      pattern &&
      row[columnName] &&
      row[columnName].toString().trim() !== "" &&
      !pattern.test(row[columnName])
    ) {
      onError(
        new Error(
          `Field '${columnName}' does not have data in correct format ${row[columnName]}.`
        )
      );
      return null;
    }

    filteredRow[jsonFieldName] = row[columnName];
  }

  return filteredRow;
};

/**
 * Creates Papa Parse configuration
 */
const createParseConfig = (
  csvData: CSV_ROW[],
  columnMappings: CSV_COLUMN_MAPPING[],
  resolve: (data: CSV_ROW[]) => void,
  reject: (error: Error) => void
) => {
  return {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    step: (results: ParseStepResult<CSV_ROW>) => {
      const processedRow = processRow(results.data, columnMappings, reject);
      if (processedRow) {
        csvData.push(processedRow);
      }
    },
    complete: () => {
      resolve(csvData);
    },
    error: (error: Papa.ParseError) => {
      reject(
        new Error(error.message || "An error occurred while parsing the CSV.")
      );
    },
  };
};

/**
 * Parse a CSV file and return JSON data with specified columns.
 * If no columns are specified, all columns will be included.
 * @param file - The File object representing the CSV file.
 * @param columnMappings - An object mapping CSV column names to desired JSON keys.
 * @returns Promise resolving to JSON data.
 */
export const parseCsvToJson = async (
  file: File,
  columnMappings: CSV_COLUMN_MAPPING[]
): Promise<any[]> => {
  return new Promise<any[]>((resolve, reject) => {
    const csvData: CSV_ROW[] = [];
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      if (event.target?.result) {
        const csvString = event.target.result as string;
        const config = createParseConfig(
          csvData,
          columnMappings,
          resolve,
          reject
        );
        // @ts-ignore
        Papa.parse(csvString, config);
      }
    };

    fileReader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(
        new Error(
          (error.target as FileReader).error?.message ||
            "An error occurred while reading the file."
        )
      );
    };

    fileReader.readAsText(file);
  });
};
