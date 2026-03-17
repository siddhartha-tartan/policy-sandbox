type ValidationCallback = (
  isValid: boolean,
  message: string,
  data?: Record<string, string>[]
) => void;

export const validateUploadedCSV = (
  file: File | null,
  expectedHeaders: string[],
  callback: ValidationCallback
): void => {
  if (!file) {
    console.error("No file provided");
    return callback(false, "No file provided");
  }

  const reader = new FileReader();
  reader.onload = (event: ProgressEvent<FileReader>) => {
    const text = event.target?.result as string;
    if (!text) {
      return callback(false, "Failed to read the file.");
    }

    const rows = text
      ?.trim()
      ?.split("\n")
      ?.map((row) => row?.split(",")?.map((cell) => cell?.trim()));

    if (rows.length < 2) {
      return callback(false, "CSV must have at least one data row.");
    }

    // Extract headers from the first row
    const uploadedHeaders = rows[0];

    // Check if headers match
    const missingHeaders = expectedHeaders.filter(
      (header) => !uploadedHeaders.includes(header)
    );
    if (missingHeaders.length > 0) {
      return callback(false, `Missing headers: ${missingHeaders.join(", ")}`);
    }

    // Process and validate rows
    const jsonData: Record<string, string>[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Ensure each row has the correct number of columns
      if (row.length !== expectedHeaders.length) {
        return callback(false, `Row ${i + 1} has missing or extra values.`);
      }

      // Check for empty, null, or undefined values
      if (
        row.some(
          (cell) =>
            cell === "" ||
            cell.toLowerCase() === "null" ||
            cell.toLowerCase() === "undefined"
        )
      ) {
        return callback(
          false,
          `Row ${i + 1} contains empty, null, or undefined values.`
        );
      }

      // Convert row to JSON object
      const rowObject: Record<string, string> = {};
      uploadedHeaders.forEach((header, index) => {
        rowObject[header] = row[index];
      });

      jsonData.push(rowObject);
    }

    // Pass the validated JSON data to the callback
    return callback(true, "CSV is valid.", jsonData);
  };

  reader.readAsText(file);
};
