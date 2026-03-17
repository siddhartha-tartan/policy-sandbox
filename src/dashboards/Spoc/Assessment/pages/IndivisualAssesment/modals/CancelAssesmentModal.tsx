import { Flex } from "@chakra-ui/react";
import { WarningError } from "react-huge-icons/outline";
import CustomModal from "../../../../../../components/common/CustomModal";
import { systemColors } from "../../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import useDeleteAssesment from "../hooks/useDeleteAssesment";
interface IProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}
export default function CancelAssesmentModal({ isOpen, onClose, id }: IProps) {
  const { isLoading, mutate } = useDeleteAssesment();
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
            w={"66px"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"999px"}
            h="66px"
            bgColor={"#fcd6d2"}
          >
            <Flex
              w={"46px"}
              borderRadius={"999px"}
              justifyContent={"center"}
              alignItems={"center"}
              h="46px"
              bgColor={"#f7b7a1"}
            >
              <WarningError color="#BF360C" fontSize={"24px"} />
            </Flex>
          </Flex>
          <Flex flexDir={"column"} gap={2}>
            <CustomText stylearr={[14, 20, 700]}>
              This assessment is already scheduled.
            </CustomText>
            <CustomText
              textAlign={"center"}
              color={systemColors.grey[600]}
              stylearr={[14, 20, 500]}
            >
              Are you sure you want to cancel it?
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
            onClick={() =>
              mutate(
                { assesmentId: id },
                {
                  onSuccess() {
                    onClose();
                  },
                }
              )
            }
            isLoading={isLoading}
          >
            Yes, Cancel
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
