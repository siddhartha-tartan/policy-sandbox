import { Flex, Input } from "@chakra-ui/react";
import { useRef } from "react";
import { FileUpload } from "react-huge-icons/outline";
import { GrPowerCycle } from "react-icons/gr";
import { PiFilePdfLight } from "react-icons/pi";
import { SlTrash } from "react-icons/sl";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface POLICY_UPLOAD {
  error: string | undefined;
  file: File | null | undefined;
  url: string | null | undefined;
}

interface IProp {
  file: POLICY_UPLOAD;
  setFile: (e: POLICY_UPLOAD) => void;
  name?: string;
}

export default function PolicyUpload({ file, setFile, name = "" }: IProp) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempFile = event.target.files?.[0];
    if (tempFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(tempFile.type)) {
        setFile({
          ...file,
          error: "Only PDF, DOC, or DOCX files are allowed.",
        });
        return;
      }

      // Validate file size
      if (tempFile.size > MAX_FILE_SIZE_BYTES) {
        setFile({
          ...file,
          error: `File size should not exceed ${MAX_FILE_SIZE_MB}MB.`,
        });
        return;
      }

      // Valid file
      setFile({
        file: tempFile,
        error: ``,
        url: null,
      });
    }
  };

  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <Flex
        p={"6px 10px 6px 20px"}
        w={"full"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderWidth={"1px"}
        borderColor={systemColors.grey[300]}
        borderRadius={"10px"}
      >
        {file.file || file.url ? (
          <Flex gap={4} alignItems={"center"}>
            <PiFilePdfLight color={systemColors.black.absolute} size={"28px"} />
            {file.file ? (
              <Flex gap={"2px"} flexDir={"column"}>
                <CustomText
                  stylearr={[14, 20, 600]}
                  color={systemColors.grey[700]}
                  className="underline underline-offset-4"
                >
                  {file.file.name}
                </CustomText>
                <CustomText
                  stylearr={[14, 20, 500]}
                  color={systemColors.grey[500]}
                >
                  {(file.file.size / 1024 / 1024).toFixed(2)}mb
                </CustomText>
              </Flex>
            ) : (
              <Flex gap={"2px"} flexDir={"column"}>
                <CustomText
                  stylearr={[14, 20, 600]}
                  color={systemColors.grey[700]}
                  className="underline underline-offset-4"
                >
                  {name}
                </CustomText>
              </Flex>
            )}
          </Flex>
        ) : (
          <CustomText stylearr={[14, 22, 400]} color={systemColors.black[900]}>
            Upload DOC/DOCX files up to {MAX_FILE_SIZE_MB} MB{" "}
          </CustomText>
        )}
        {file.file || file.url ? (
          <Flex gap={"24px"}>
            <CustomButton
              variant="tertiary"
              borderRadius={"6px"}
              borderColor={systemColors.black[400]}
              h={"44px"}
              w="184px"
              fontSize={"14px"}
              leftIcon={<GrPowerCycle fontSize={"20px"} />}
              fontWeight={500}
              onClick={() => ref?.current?.click?.()}
            >
              Re-Upload
            </CustomButton>
            <CustomButton
              variant="tertiary"
              w="184px"
              borderRadius={"6px"}
              borderColor={systemColors.black[400]}
              h={"44px"}
              fontSize={"16px"}
              leftIcon={<SlTrash fontSize={"20px"} />}
              fontWeight={500}
              onClick={() => setFile({ error: "", file: null, url: null })}
            >
              Delete
            </CustomButton>
          </Flex>
        ) : (
          <CustomButton
            variant="tertiary"
            className="border-[1px] border-[#1870C2] rounded-[10px] py-3 p-4 h-fit"
            fontSize={"14px"}
            leftIcon={<FileUpload fontSize={"20px"} />}
            fontWeight={500}
            onClick={() => ref?.current?.click?.()}
            style={{
              background:
                "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
            }}
          >
            Upload File
          </CustomButton>
        )}
        <Input
          ref={ref}
          display={"none"}
          accept=".doc,.docx,.pdf"
          onChange={handleFileChange}
          type="file"
        />
      </Flex>
      {file.error && (
        <CustomText color={systemColors.red.A700} stylearr={[14, 22, 500]}>
          {file.error}
        </CustomText>
      )}
    </>
  );
}
