import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { ChangeEvent, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileDownload } from "react-huge-icons/outline";
import { FiUpload } from "react-icons/fi";
import { GrPowerCycle } from "react-icons/gr";
import { IoPlay } from "react-icons/io5";
import CustomDocumentInput from "../../../../../../common/CustomDocumentInput";
import { systemColors } from "../../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { Variable } from "../../../../AdvancedDataCreation/hooks/useGetVariables";
import { stepperAtom } from "../atom";
import { validateUploadedCSV } from "../utils/helpers";
import { testDataAtom } from "../../../../AdvancedDataCreation/advancedDataCreationAtom";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_ROUTES } from "../../../../../../../utils/constants/constants";
import { TESTBED_SUB_ROUTES } from "../../../../../contants";
import { HISTORICAL_DATA_TESTING_SUB_ROUTES } from "../../../constants";
import useGetUserType from "../../../../../../../hooks/useGetUserType";

const UploadCsv = ({ variables }: { variables: Variable[] }) => {
  const { categoryId, policyId, fileId } = useParams();
  const userType = useGetUserType();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const step = useAtomValue(stepperAtom);
  const [error, setError] = useState<boolean>(false);
  const headers = variables?.map((item) => item.name);
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const setTestData = useSetAtom(testDataAtom);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement> | File[]) => {
    let uploadedFile: File | null = null;

    if (Array.isArray(event)) {
      uploadedFile = event[0];
    } else if (event.target?.files) {
      uploadedFile = event.target.files[0];
    }
    if (uploadedFile) {
      validateUploadedCSV(
        uploadedFile,
        headers,
        (isValid, message, jsonData) => {
          if (isValid) {
            setFile(uploadedFile);
            setParsedData(jsonData || []);
            setError(false);
          } else {
            setError(true);
            console.error("CSV validation failed:", message);
          }
        }
      );
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: {
      "text/csv": [".csv"],
    },
  });

  const handleSubmit = () => {
    const testData = parsedData?.map((item, index) => ({
      ...item,
      expected_output: "fail",
      id: index.toString(),
      sno: index + 1,
    }));

    setTestData(testData);
    navigate(
      `${BASE_ROUTES[userType]}/testbed/${
        TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING
      }/${HISTORICAL_DATA_TESTING_SUB_ROUTES.TEST?.replace(
        ":categoryId",
        categoryId!
      )
        .replace(":policyId", policyId!)
        .replace(":fileId", fileId!)}`
    );
  };

  return (
    <div className="flex flex-col p-4 gap-6 border rounded-[6px]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
          <CustomText stylearr={[12, 16, 600]}>Step 3</CustomText>
          <FiUpload />
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[16, 20, 700]}>Upload Your Data</CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              Upload your file in CSV format with historical data
            </CustomText>
          </div>
        </div>
        <CustomButton
          variant="quaternary"
          fontSize={"14px"}
          lineHeight={"18px"}
          px={6}
          h={"45px"}
          gap={1}
          leftIcon={<IoPlay />}
          isDisabled={!file || error}
          onClick={handleSubmit}
        >
          Initiate Testing
        </CustomButton>
      </div>
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`flex border-2 border-dashed w-full h-full items-center justify-center	 flex flex-col gap-2 rounded-[6px] p-6 ${
                error
                  ? "bg-[#FFD8D4] border-[#E64A19]"
                  : "bg-white border-[#E9E9E9]"
              }`}
            >
              <div
                className="border rounded-[60px] p-[10px] m-auto"
                style={{
                  background:
                    " linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                }}
              >
                <FileDownload style={{ color: systemColors.white.absolute }} />
              </div>
              <div className="flex flex-row gap-4 items-center">
                {file ? (
                  <div
                    className="flex flex-col gap-2 items-center justify-center"
                    {...getRootProps()}
                  >
                    <div className="flex flex-row gap-4 w-full items-center justify-between">
                      <div className="flex gap-4 w-3/5">
                        <div className="text-[#3762DD] text-sm font-semibold	underline-offset-2 leading-5">
                          {file.name}
                        </div>
                      </div>
                      <label>
                        <div className="flex justify-between gap-[14px]">
                          <CustomDocumentInput
                            ref={inputRef}
                            onChange={handleFileChange}
                            {...getInputProps()}
                            accept={[".csv"]}
                          />
                          <CustomButton
                            variant="secondary"
                            fontSize={"14px"}
                            lineHeight={"18px"}
                            h={"45px"}
                            style={{ color: "#555557" }}
                            leftIcon={<GrPowerCycle />}
                          >
                            Re-Upload
                          </CustomButton>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex gap-4 w-full justify-between"
                    {...getRootProps()}
                  >
                    <div className="flex row gap-4">
                      <div className="flex flex-col gap-1 justify-center text-center w-[120px]">
                        <CustomText stylearr={[14, 18, 600]} color={"#3762DD"}>
                          Drag and Drop your CSV file here
                        </CustomText>
                        <CustomText stylearr={[10, 12, 500]} color={"#667085"}>
                          CSV up to 5MB
                        </CustomText>
                      </div>
                      <div className="flex items-center justify-center text-center w-[70px]">
                        <CustomText stylearr={[14, 18, 600]} color={"#555557"}>
                          OR
                        </CustomText>
                      </div>
                      <label>
                        <CustomDocumentInput
                          ref={inputRef}
                          onChange={handleFileChange}
                          {...getInputProps()}
                          accept={[".csv"]}
                        />
                        <CustomButton variant="secondary">
                          Browse Files
                        </CustomButton>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {error ? (
                <CustomText
                  stylearr={[12, 18, 600]}
                  className="text-center"
                  color={"#E64A19"}
                >
                  Validation Failed, Invalid Data!
                </CustomText>
              ) : (
                <CustomText
                  stylearr={[12, 18, 400]}
                  className="text-center"
                  color={"#667085"}
                >
                  Your file will be automatically validated. Error messages will
                  appear if the format does not match the required structure.
                </CustomText>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCsv;
