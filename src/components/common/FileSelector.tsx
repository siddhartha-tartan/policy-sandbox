import { Box, HStack, StackDivider } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GrPowerCycle } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import CustomButton from "../DesignSystem/CustomButton";
import CustomText from "../DesignSystem/Typography/CustomText";
import { PiFileCsvLight } from "react-icons/pi";

export const validateHeaders = (
  headers: string[],
  requiredHeaders?: string[]
): string | null => {
  if (!requiredHeaders) return null;
  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );
  if (missingHeaders.length > 0) {
    return `Missing headers: ${missingHeaders.join(", ")}`;
  }
  return null;
};

export const parseCSV = (csvContent: string): Record<string, string>[] => {
  const [headerLine, ...rows] = csvContent.split("\n").filter(Boolean);
  const headers = headerLine.split(",")?.map((header) => header.trim());
  return rows?.map((row) => {
    const values = row.split(",");
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index]?.trim() || "";
      return acc;
    }, {} as Record<string, string>);
  });
};

interface FileSelectorProps {
  acceptedFileTypes: string; // e.g., ".csv, .xlsx"
  maxFileSizeMB: number;
  requiredHeaders?: string[];
  validateRow?: (row: Record<string, string>) => string | null; // Row-level validation
  onFileSelect: (
    file: File | null,
    validRows?: Record<string, string>[]
  ) => void;
  onError: (error: string) => void;
  sampleFileUrl?: string;
  sampleFileName?: string;
  labels?: {
    browseFile?: string;
    fileSize?: string;
    reUpload?: string;
    delete?: string;
    sampleFile?: string;
    downloadSample?: string;
    note?: string;
  };
}

const FileSelector: React.FC<FileSelectorProps> = ({
  acceptedFileTypes,
  maxFileSizeMB,
  requiredHeaders,
  validateRow,
  onFileSelect,
  onError,
  sampleFileUrl,
  sampleFileName = "sample_file",
  labels = {},
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!sampleFileUrl) return;

    const link = document.createElement("a");
    link.href = sampleFileUrl;
    link.download = sampleFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (
      !acceptedFileTypes
        .split(",")
        .some((type) => selectedFile.name.endsWith(type.trim()))
    ) {
      const errorMessage = `Invalid file type. Only ${acceptedFileTypes} files are allowed.`;
      setError(errorMessage);
      onError(errorMessage);
      return;
    }

    // Validate file size
    const maxSizeInBytes = maxFileSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      const errorMessage = `File size exceeds the ${maxFileSizeMB}MB limit.`;
      setError(errorMessage);
      onError(errorMessage);
      setFile(null);
      onFileSelect(null);
      return;
    }

    // Read and validate file content
    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      // Validate headers
      const headers = Object.keys(rows[0] || {});
      const headerError = validateHeaders(headers, requiredHeaders);
      if (headerError) {
        setError(headerError);
        onError(headerError);
        setFile(null);
        onFileSelect(null);
        return;
      }

      // Validate rows
      if (validateRow) {
        for (const row of rows) {
          const rowError = validateRow(row);
          if (rowError) {
            setError(rowError);
            onError(rowError);
            setFile(null);
            onFileSelect(null);
            return;
          }
        }
      }

      // File is valid
      setError("");
      onError("");
      setFile(selectedFile);
      onFileSelect(selectedFile, rows);
    } catch (err) {
      const errorMessage = "Error reading the file. Please try again.";
      setError(errorMessage);
      onError(errorMessage);
      setFile(null);
      onFileSelect(null);
    }
  };

  return (
    <Box className="flex w-full flex-col gap-3 h-full justify-center">
      <HStack
        divider={<StackDivider borderColor={"#ECEFF1"} />}
        className="flex w-full border-[1px] py-[28px] bg-white border-dashed h-[180px] rounded-[8px] gap-[44px]"
        borderColor={error ? "#E64A19" : "#D0D5DD"}
      >
        <Box className="flex-1 flex justify-center items-end flex-col">
          <Box
            className="flex gap-5 items-center"
            cursor={file ? "initial" : "pointer"}
            onClick={() => {
              if (!file) {
                try {
                  //@ts-ignore
                  ref.current.value = "";
                } catch (e) {
                  console.error('issue: ref.current.value = "": ', e);
                }
                if (ref?.current) {
                  ref?.current?.click();
                }
              }
            }}
          >
            <PiFileCsvLight fontSize={"34px"} />
            <Box className="flex gap-[6px] flex-col max-w-[80%]">
              <CustomText
                stylearr={[16, 20, 600]}
                noOfLines={1}
                className="underline underline-offset-4 text-[#344054] max-w-[200px]"
              >
                {file ? file?.name : labels.browseFile || "Browse File"}
              </CustomText>
              <CustomText stylearr={[14, 20, 500]} className="text-[#667085]">
                {file
                  ? `${(file?.size / 1024 / 1024).toFixed(1)}mb`
                  : labels.fileSize || `Max ${maxFileSizeMB}MB`}
              </CustomText>
            </Box>
          </Box>
        </Box>

        <Box className="flex-1 flex justify-start items-center">
          {file ? (
            <Box className="flex gap-6 w-[184px] flex-col cursor-pointer">
              <CustomButton
                leftIcon={<GrPowerCycle />}
                variant="secondary"
                className="w-full"
                onClick={() => {
                  ref?.current?.click();
                  setError("");
                }}
              >
                {labels.reUpload || "Re-Upload"}
              </CustomButton>
              <CustomButton
                leftIcon={<MdDeleteOutline fontSize={"18px"} />}
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setFile(null);
                  setError("");
                  onFileSelect(null);
                }}
              >
                {labels.delete || "Delete"}
              </CustomButton>
            </Box>
          ) : (
            sampleFileUrl && (
              <Box className="flex gap-1 flex-col cursor-pointer">
                <CustomText stylearr={[14, 24, 500]}>
                  {labels.sampleFile || "Sample File"}
                </CustomText>
                <CustomText
                  color={"#1A237E"}
                  stylearr={[14, 24, 700]}
                  className="underline underline-offset-2 cursor-pointer"
                  onClick={handleDownloadClick}
                >
                  {labels.downloadSample || "Download Sample"}
                </CustomText>
              </Box>
            )
          )}
        </Box>
      </HStack>
      {error ? (
        <CustomText color={"#E64A19"} stylearr={[14, 20, 500]}>
          {error}
        </CustomText>
      ) : (
        labels.note && (
          <CustomText stylearr={[14, 24, 400]}>{labels.note}</CustomText>
        )
      )}
      <input
        type="file"
        ref={ref}
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </Box>
  );
};

export default FileSelector;
