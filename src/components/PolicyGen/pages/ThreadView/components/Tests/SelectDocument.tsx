import { Box, HStack, StackDivider } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useRef } from "react";
import { GrPowerCycle } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { PiFileCsvLight } from "react-icons/pi";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { csvFileAtom, fileErrorAtom } from "../../threadAtom";

const requiredHeaders = [
  "Name",
  "Age",
  "CIBIL Score",
  "KYC Complete",
  "Bank Statements",
  "Monthly Turnover/Income",
  "Primary source of Income",
  "Professional Experience (in Years)",
  "Loan Amount",
  "Tenure (in Days)",
  "Type of Residence",
  "Eligible for Loan",
  "Expected",
]; // Replace with your required headers
export default function SelectDocument() {
  const [file, setFile] = useAtom(csvFileAtom);
  const [error, setError] = useAtom(fileErrorAtom);
  const ref = useRef<HTMLInputElement | null>(null);

  const handleDownloadClick = (e: any) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = "/sample.csv";
    link.download = "sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Validate file type
    if (selectedFile.type !== "text/csv") {
      setError("Invalid file type. Only CSV files are allowed.");
      return;
    }

    // Validate file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSizeInBytes = 20 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      setError("File size exceeds the 20MB limit.");
      setFile(null);
      return;
    }

    // Read and validate CSV headers
    try {
      const text = await selectedFile.text();
      const [firstLine] = text.split("\n");
      const headers = firstLine.split(",")?.map((header) => header.trim());

      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );

      if (missingHeaders.length > 0) {
        setError(
          `Invalid CSV file. Missing required headers: ${missingHeaders.join(
            ", "
          )}`
        );
        setFile(null);
        return;
      }

      // Clear errors and set the file
      setError("");
      setFile(selectedFile);
    } catch (error) {
      setError("Error reading the CSV file. Please try again.");
      setFile(null);
    }
  };

  // return (
  //   <FileSelector
  //     acceptedFileTypes=".csv"
  //     maxFileSizeMB={20}
  //     requiredHeaders={requiredHeaders}
  //     onFileSelect={(file) => setFile(file)}
  //     onError={(error) => setError(error)}
  //     sampleFileUrl="/sample.csv"
  //     sampleFileName="sample.csv"
  //     labels={{
  //       browseFile: "Select Your File",
  //       fileSize: "File size limit is 20MB",
  //       reUpload: "Change File",
  //       delete: "Remove File",
  //       sampleFile: "Download Template",
  //       note: "Ensure your file matches the required format.",
  //     }}
  //   />
  // );

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
              if (!file) ref?.current?.click();
            }}
          >
            <PiFileCsvLight fontSize={"34px"} />
            <Box className="flex gap-[6px] flex-col max-w-[80%]">
              <CustomText
                stylearr={[16, 20, 600]}
                noOfLines={1}
                className="underline underline-offset-4 text-[#344054] max-w-[200px]"
              >
                {file ? file?.name : "Browse File"}
              </CustomText>
              <CustomText stylearr={[14, 20, 500]} className="text-[#667085]">
                {file
                  ? `${(file?.size / 1024 / 1024).toFixed(1)}mb`
                  : "in csv format (max limit is 20 mb)"}
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
                  {
                    ref?.current?.click();
                    setError("");
                  }
                }}
              >
                Re-Upload
              </CustomButton>
              <CustomButton
                leftIcon={<MdDeleteOutline fontSize={"18px"} />}
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setFile(null);
                  setError("");
                }}
              >
                Delete
              </CustomButton>
            </Box>
          ) : (
            <Box className="flex gap-1 flex-col cursor-pointer">
              <CustomText stylearr={[14, 24, 500]}>Sample CSV file</CustomText>
              <CustomText
                color={"#1A237E"}
                stylearr={[14, 24, 700]}
                className="underline underline-offset-2 cursor-pointer"
                onClick={handleDownloadClick}
              >
                Download file
              </CustomText>
            </Box>
          )}
        </Box>
      </HStack>
      {error ? (
        <CustomText color={"#E64A19"} stylearr={[14, 20, 500]}>
          {error}
        </CustomText>
      ) : (
        <CustomText stylearr={[14, 24, 400]}>
          *Note: First row in your csv file will be taken as row headings and
          below ones will be taken as its data.
        </CustomText>
      )}
      <input
        type="file"
        ref={ref}
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </Box>
  );
}
