import { Flex, Image } from "@chakra-ui/react";
import img from "../../../../../assets/Images/contentError.png";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const UploadError = ({ onBack }: { onBack: () => void }) => {
  return (
    <Flex className="p-6 flex-col gap-6 w-[427px]">
      <Flex className="flex-col gap-2 justify-center text-center">
        <Image src={img} w={"140px"} h={"125px"} mx={"auto"} />
        <CustomText stylearr={[16, 19, 700]}>Unable to upload file</CustomText>
        <CustomText stylearr={[12, 15, 500]}>
          The file couldn't be uploaded due to validation error. Please ensure
          your file is in CSV format and under 20mb, then try again.
        </CustomText>
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
          onClick={onBack}
        >
          Try Again
        </CustomButton>
      </Flex>
    </Flex>
  );
};

export default UploadError;
