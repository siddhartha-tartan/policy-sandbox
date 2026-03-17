import { Divider, Flex, Image, Text } from "@chakra-ui/react";
import { motion, Transition } from "framer-motion";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { GrPowerCycle } from "react-icons/gr";
import img from "../../../../../assets/Images/FileUploadImage.png";
import { parseCsvToJson } from "../../../../../utils/helpers/csvtojson";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { variableParsedData } from "../atom";
import { validateCsvData, VariableMappingCsvColumns } from "../utils/constant";

const MotionText = motion(Text);
const hoverTransition: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};

const FileUpload = ({
  onError,
  onBack,
  onClose,
}: {
  onError: () => void;
  onBack: () => void;
  onClose: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const setParsedData = useSetAtom(variableParsedData);
  const onUpload = () => {
    try {
      //@ts-ignore
      fileRef.current.value = "";
    } catch (e) {
      console.error('issue: fileRef.current.value = "": ', e);
    }
    if (fileRef?.current) {
      fileRef?.current?.click();
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }
    setFile(selectedFile);
  };

  const handleDownloadSample = (e: any) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = "/variable_mapping_sample.csv";
    link.download = "variable_mapping_sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleError = () => {
    onError();
    setFile(null);
  };

  const parseData = () => {
    if (!file) return;
    const maxSizeInBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      handleError();
      return;
    }
    parseCsvToJson(file, VariableMappingCsvColumns)
      .then((data) => {
        let hasErrors = !data?.length;

        if (hasErrors) {
          handleError();
        } else {
          const validationError = data?.some((row) =>
            validateCsvData(row, VariableMappingCsvColumns)
          );
          if (validationError) {
            handleError();
          } else {
            const finalData = data?.map((item) => ({
              ...item,
              description: item?.description?.toString(),
            }));
            setParsedData(finalData);
            onClose();
          }
        }
      })
      .catch((error) => {
        console.error("Error parsing CSV:", error);
        handleError();
      });
  };

  return (
    <Flex className="p-6 flex-col gap-6 w-[517px]">
      <Flex className="p-6 flex-col gap-4 justify-center items-center border border-dashed rounded-[16px]">
        {file ? (
          <Flex className="flex-row gap-4 w-full justify-center">
            <Flex className="flex gap-[6px] flex-col">
              <CustomText
                stylearr={[16, 20, 600]}
                noOfLines={1}
                className="underline underline-offset-4 text-[#344054]"
                isTruncated
                title={file.name}
                maxW={"250px"}
              >
                {file.name}
              </CustomText>
              <CustomText stylearr={[14, 20, 500]} className="text-[#667085]">
                {`${(file.size / 1024 / 1024).toFixed(1)}mb`}
              </CustomText>
            </Flex>
            <Flex className="flex gap-6 flex-col cursor-pointer">
              <CustomButton
                leftIcon={<GrPowerCycle />}
                variant="secondary"
                className="w-fit"
                onClick={() => {
                  setFile(null);
                }}
              />
            </Flex>
          </Flex>
        ) : (
          <>
            <Flex className="flex-row gap-4 cursor-pointer" onClick={onUpload}>
              <Image src={img} w={"52px"} h={"48px"} />
              <Flex className="flex-col gap-[5px]">
                <CustomText
                  stylearr={[17, 24, 600]}
                  color={systemColors.grey[700]}
                >
                  Upload file
                </CustomText>
                <CustomText
                  stylearr={[14, 20, 500]}
                  color={systemColors.grey[500]}
                >
                  in csv format (max limit is 20 mb)
                </CustomText>
              </Flex>
            </Flex>
            <input
              onChange={handleFileChange}
              className="hidden"
              accept=".csv"
              type="file"
              ref={fileRef}
            />
          </>
        )}

        <Divider />
        <Flex className="flex-row gap-4">
          <CustomText stylearr={[15, 24, 600]} color={systemColors.grey[700]}>
            Sample CSV File
          </CustomText>
          <MotionText
            fontSize={"16px"}
            lineHeight={"24px"}
            fontWeight={700}
            className="cursor-pointer"
            textDecoration="underline"
            color={systemColors.indigo[600]}
            whileHover={{ scale: 1.05 }} // Hover effect
            whileTap={{ scale: 0.95 }} // Optional tap effect for better UX
            transition={hoverTransition}
            onClick={handleDownloadSample}
          >
            Download File
          </MotionText>
        </Flex>
      </Flex>
      <Flex className="flex-row gap-4">
        <CustomButton
          variant="secondary"
          className="flex-1 text-sm rounded-[12px]"
          style={{ borderColor: systemColors.primary }}
          onClick={onBack}
        >
          Go Back
        </CustomButton>
        <CustomButton
          className="flex-1 text-sm rounded-[12px]"
          isDisabled={!file}
          onClick={parseData}
        >
          Proceed
        </CustomButton>
      </Flex>
    </Flex>
  );
};

export default FileUpload;
