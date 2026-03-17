type JsonObject = { [key: string]: any };

export default function jsonToCsv(jsonData: JsonObject[]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(jsonData) || jsonData?.length === 0) {
        throw new Error("Input data must be a non-empty array of objects.");
      }

      const sanitize = (val: any): any => {
        if (
          typeof val === "string" &&
          ["=", "+", "-", "@"].includes(val.charAt(0))
        ) {
          return `'${val}`;
        }
        return val;
      };

      const headers = Object.keys(jsonData[0]);

      const rows = jsonData?.map((row) =>
        headers
          ?.map((header) => {
            let value = sanitize(row[header]);
            if (Array.isArray(value)) {
              const sanitizedArray = value.map((item) => sanitize(item));
              return `"${sanitizedArray.join(", ")}"`;
            }
            return `"${value ?? ""}"`;
          })
          .join(","),
      );

      const csvData = [headers.join(","), ...rows].join("\n");
      resolve(csvData);
    } catch (error) {
      console.error("Error converting JSON to CSV:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        return reject(error);
      } else {
        console.error("Unknown error:", error);
        return reject(new Error("An unknown error occurred"));
      }
    }
  });
}
