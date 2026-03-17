import { ChevronDownIcon } from "@chakra-ui/icons";
import { Divider, ListItem, UnorderedList, useToast } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { Trash } from "react-huge-icons/outline";
import CsvIcon from "../../../../../../assets/Icons/CsvIcon";
import { userStore } from "../../../../../../store/userStore";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CustomDocumentInput from "../../../../CustomDocumentInput";
import GradientText from "../../../../GradientText/GradientText";
import { validateUploadedCSV, validateUploadedEditCsv } from "../utils/helpers";
import { CsvParsedUser } from "../view";

const pointsToRemenber = [
  "Only User, Policy Manager and Assessment Managers can be added via Bulk Upload.",
  " Admins cannot be added via Bulk upload.",
  "Do not change the headers of the sample csv file.",
  "File must be in CSV format and maximum file size: 20MB",
  "Mandatory Fields include : Employee ID, Name, Email, Role, Product Category.",
  "Atleast 1 product category is mandatory, for multiple categories put comma separated categories without spacing.",
  "Only User, Policy Manager and Assessment Managers can be added via Bulk Upload.",
  "Employee ID, Email addresses and mobile numbers must be unique.",
];

interface UploadUserCsvProps {
  setUserData: Dispatch<SetStateAction<CsvParsedUser[]>>;
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
  isEdit: boolean;
}

export default function UploadUserCsv({
  setUserData,
  setStep,
  step,
  isEdit,
}: UploadUserCsvProps) {
  const [isOpen, setIsOpen] = useState<boolean>(step === 1);
  const [error, setError] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();
  const { editableLoanCategories } = userStore();

  // Update isOpen when step changes
  useEffect(() => {
    // When step changes to 2, collapse step 1
    if (step !== 1) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [step]);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement> | File[]
  ) => {
    let uploadedFile: File | null = null;

    if (Array.isArray(event)) {
      uploadedFile = event[0];
    } else if (event.target?.files) {
      uploadedFile = event.target.files[0];
    }

    if (uploadedFile) {
      setFile(uploadedFile);
      setIsLoading(true);
      setError(false);

      const valdationFunction = isEdit
        ? validateUploadedEditCsv
        : validateUploadedCSV;

      try {
        const result = await valdationFunction(
          uploadedFile,
          editableLoanCategories
        );

        if (result?.error) {
          setError(true);
          toast({
            title: "CSV Validation Failed",
            description: result.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else if (result?.data) {
          setUserData(result.data as CsvParsedUser[]);
          setError(false);
          toast({
            title: "CSV Validation Successful",
            description: `${result?.data?.length} records processed successfully.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // Proceed to next step
          setTimeout(() => setStep(2), 500);
        }
      } catch (err) {
        setError(true);
        toast({
          title: "Error Processing CSV",
          description:
            err instanceof Error ? err.message : "Unknown error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: {
      "text/csv": [".csv"],
    },
  });

  const handleDownloadClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const path = isEdit
      ? "EDIT_USER_SAMPLE_CSV.csv"
      : "ADD_USER_SAMPLE_CSV.csv";
    const link = document.createElement("a");
    link.href = `/${path}`;
    link.download = path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex w-full flex-col p-6 border rounded-[16px] gap-5">
      <div className="flex flex-row justify-between">
        {" "}
        <div className="flex flex-row gap-2 items-center">
          <CustomText stylearr={[16, 24, 400]} color={"#141414"}>
            Step 1
          </CustomText>
          <CustomText stylearr={[16, 20, 600]} color={"#141414"}>
            Upload your CSV File to initiate data transfer
          </CustomText>
        </div>{" "}
        <motion.button
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDownIcon />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className={`flex h-[108px] border-2 border-dashed rounded-[8px] justify-center items-center ${
                error && "border-[#E64A19]"
              }`}
              style={{
                background: error
                  ? "#FFD8D433"
                  : "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
              }}
            >
              {file ? (
                <div className="flex flex-row gap-6 justify-center items-center">
                  <div className="flex flex-row gap-3">
                    <div
                      className="h-[44px] w-[44px] flex items-center justify-center rounded-[6px]"
                      style={{
                        background:
                          "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                      }}
                    >
                      <CsvIcon color={systemColors.white.absolute} />
                    </div>{" "}
                    <div className="flex flex-col gap-1">
                      <CustomText
                        stylearr={[16, 20, 600]}
                        color={"#141414"}
                        w={"127px"}
                        isTruncated
                      >
                        {file?.name}
                      </CustomText>
                      <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                        {file?.size ? file.size / 1000 + " Kb" : ""}
                      </CustomText>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <label {...getRootProps()}>
                      <CustomDocumentInput
                        ref={inputRef}
                        onChange={handleFileChange}
                        {...getInputProps()}
                        accept={[".csv"]}
                      />
                      <CustomButton
                        variant="secondary"
                        className="w-[137px] h-[40px]"
                        style={{
                          background: "#00000005",
                          borderColor: "#00000014",
                        }}
                        isLoading={isLoading}
                      >
                        Re-Upload
                      </CustomButton>
                    </label>
                    <CustomButton
                      variant="secondary"
                      className="w-[111px] h-[40px]"
                      style={{
                        background: "#FFD8D433",
                        borderColor: "#FFD8D4",
                        color: "#E64A19",
                      }}
                      leftIcon={<Trash />}
                      onClick={() => {
                        setFile(null);
                        setError(false);
                      }}
                      isDisabled={isLoading}
                    >
                      Delete
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-row gap-6 justify-center items-center"
                  {...getRootProps()}
                >
                  <div className="flex flex-row gap-3">
                    <div className="w-[44px] h-[44px] border border-[#3762DD] rounded-[6px] flex items-center justify-center">
                      <CsvIcon />
                    </div>
                    <label>
                      <CustomDocumentInput
                        ref={inputRef}
                        onChange={handleFileChange}
                        {...getInputProps()}
                        accept={[".csv"]}
                      />
                      <div className="flex flex-col gap-1">
                        <CustomText stylearr={[16, 20, 600]} color={"#141414"}>
                          Upload CSV{" "}
                        </CustomText>
                        <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                          In CSV format (max limit is 20mb)
                        </CustomText>
                      </div>
                    </label>
                  </div>
                  <Divider orientation="vertical" />
                  <div className="flex flex-col gap-1">
                    {" "}
                    <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                      Sample CSV File
                    </CustomText>
                    <GradientText
                      text={"Download File"}
                      gradient={
                        "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                      }
                      className="text-xs font-semibold cursor-pointer"
                      onClick={handleDownloadClick}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <CustomText stylearr={[14, 20, 600]} color={"#555557"}>
                Before You Upload:
              </CustomText>
              <UnorderedList>
                {pointsToRemenber?.map((item) => (
                  <ListItem key={item}>
                    <CustomText stylearr={[13, 24, 400]} color={"#555557"}>
                      {item}
                    </CustomText>
                  </ListItem>
                ))}
              </UnorderedList>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
