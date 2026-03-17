import { Flex } from "@chakra-ui/react";
import React from "react";
import CustomModal from "../../../../components/common/CustomModal";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";

interface EditConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const EditConfirmationModal: React.FC<EditConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex
        flexDir="column"
        p="24px"
        borderRadius="12px"
        w="500px"
        gap="24px"
        justifyContent="center"
        alignItems="center"
      >
        <CustomText
          color={systemColors.black.absolute}
          stylearr={[24, 32, 700]}
        >
          Modification Confirmation
        </CustomText>
        <CustomText
          color={systemColors.black.absolute}
          stylearr={[20, 30, 500]}
          textAlign="center"
        >
          On clicking Proceed, a new version would be created
        </CustomText>
        <Flex w="full" gap="24px">
          <CustomButton
            borderRadius="8px"
            borderColor={systemColors.black[200]}
            variant="tertiary"
            flex={1}
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            bgColor={systemColors.grey[900]}
            borderRadius="8px"
            flex={1}
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={onSave}
          >
            Proceed
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
};

export default EditConfirmationModal;
