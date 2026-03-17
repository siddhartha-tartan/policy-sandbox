import { Flex } from "@chakra-ui/react";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../CustomModal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
}
export default function SubmitAssesmentModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: IProps) {
  return (
    <CustomModal isOpen={isOpen || isLoading} onClose={onClose}>
      <Flex
        flexDir="column"
        p="24px"
        borderRadius="12px"
        w="500px"
        gap="32px"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          gap={"20px"}
          w={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDir={"column"}
        >
          <Flex flexDir={"column"} gap={2}>
            <CustomText textAlign={"center"} stylearr={[24, 38, 700]}>
              Are you Sure you want to submit assessment?
            </CustomText>
            <CustomText color={systemColors.grey[600]} stylearr={[16, 25, 500]}>
              Do consider re-checking your answers before submission
            </CustomText>
          </Flex>
        </Flex>
        <Flex w="full" gap="24px">
          <CustomButton
            borderRadius="8px"
            borderColor={systemColors.black[200]}
            variant="tertiary"
            flex={1}
            fontWeight={"16px"}
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            bgColor={systemColors.grey[900]}
            borderRadius="8px"
            fontWeight={"16px"}
            flex={1}
            onClick={onSave}
          >
            Submit
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
