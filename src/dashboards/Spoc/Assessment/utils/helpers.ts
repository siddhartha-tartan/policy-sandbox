import Papa from "papaparse";
import { IQuestions } from "../pages/IndivisualAssesment/hooks/useGetAssesment";

export const validateQuestionRow = (
  row: Record<string, string>
): string | null => {
  // Check if "Question" field is present and not empty
  if (!row["Question Mandatory"] || row["Question Mandatory"].trim() === "") {
    return "The 'Question' field is mandatory.";
  }

  // Check if "Option A" field is present and not empty
  if (!row["Option A Mandatory"] || row["Option A Mandatory"].trim() === "") {
    return "The 'Option A' field is mandatory.";
  }

  // Check if "Option B" field is present and not empty
  if (!row["Option B Mandatory"] || row["Option B Mandatory"].trim() === "") {
    return "The 'Option B' field is mandatory.";
  }

  // Check if "Correct Answer" field is present and valid
  const validAnswers = ["A", "B", "C", "D"];
  if (
    !row["Correct answer Mandatory(Only Add `A` `B` `C` `D`)"] ||
    !validAnswers.includes(
      row["Correct answer Mandatory(Only Add `A` `B` `C` `D`)"].trim()
    )
  ) {
    return "The 'Correct Answer' field is mandatory and must be one of: A, B, C, D.";
  }

  // Optional fields "Option C" and "Option D" do not require validation
  return null; // Valid row
};

export const parseCsvQuestions = (file: File): Promise<IQuestions[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        // Normalize and sanitize the file content to avoid encoding issues
        const sanitizeText = (text: string): string =>
          text.replace(/�/g, "").replace(/\r\n/g, "\n");

        const rawContent = reader.result as string;
        const normalizedContent = sanitizeText(rawContent);

        // Parse the normalized content
        const csvData = Papa.parse(normalizedContent, {
          header: true,
          skipEmptyLines: true,
        });

        const temp: IQuestions[] = [];

        csvData?.data?.forEach((row: any, id) => {
          const correctedAnswer =
            row["Correct answer Mandatory(Only Add `A` `B` `C` `D`)"];
          const correctedAnswerId =
            correctedAnswer === "A"
              ? 0
              : correctedAnswer === "B"
              ? 1
              : correctedAnswer === "C"
              ? 2
              : 3;

          const options = [
            {
              label: row["Option A Mandatory"],
              value: row["Option A Mandatory"],
            },
            {
              label: row["Option B Mandatory"],
              value: row["Option B Mandatory"],
            },
            ...(row["Option C"]
              ? [{ label: row["Option C"], value: row["Option C"] }]
              : []),
            ...(row["Option D"]
              ? [{ label: row["Option D"], value: row["Option D"] }]
              : []),
          ];

          if (row["Question Mandatory"]) {
            temp.push({
              question: row["Question Mandatory"],
              options: options,
              id: `${new Date().toISOString()}-${id}`,
              correctedAnswer: options[correctedAnswerId]?.value ?? "",
              correctOption: correctedAnswer ?? "",
              type: "new",
            });
          }
        });

        resolve(temp);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Read the file with UTF-8 encoding
    reader.readAsText(file, "UTF-8");
  });
};
