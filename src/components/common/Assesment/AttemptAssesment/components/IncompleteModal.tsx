import { Flex } from "@chakra-ui/react";
import { MdErrorOutline } from "react-icons/md";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../CustomModal";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}
export default function IncompleteModal({ isOpen, onClose, onSave }: IProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
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
          <Flex
            w={"52px"}
            h="52px"
            justifyContent={"center"}
            alignItems={"center"}
            color={systemColors.orange[600]}
            bgColor={systemColors.orange[50]}
            borderRadius={"12px"}
          >
            <MdErrorOutline fontSize={"24px"} />
          </Flex>
          <Flex maxW={"350px"} flexDir={"column"} gap={2}>
            <CustomText textAlign={"center"} stylearr={[24, 38, 700]}>
              Incomplete!
            </CustomText>
            <CustomText
              textAlign={"center"}
              color={systemColors.grey[600]}
              stylearr={[16, 25, 500]}
            >
              Please attempt all the questions before submitting the test.
            </CustomText>
          </Flex>
        </Flex>
        <Flex w="full" gap="24px">
          <CustomButton
            bgColor={systemColors.grey[900]}
            borderRadius="8px"
            fontWeight={"16px"}
            flex={1}
            onClick={onSave}
          >
            Ok
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
