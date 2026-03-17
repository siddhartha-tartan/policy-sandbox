import { motion } from "framer-motion";
import CustomModal from "../../../CustomModal";
import { Flex } from "@chakra-ui/react";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomButton from "../../../../DesignSystem/CustomButton";

const DeleteConfirmationModal = ({
  isOpen,
  onDelete,
  onClose,
  policyName,
}: {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
  policyName: string;
}) => {
  return (
    <CustomModal
      w={"500px"}
      className="rounded-[16px] p-6 bg-white flex"
      isOpen={isOpen}
      onClose={() => {}}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-8 w-full justify-center"
      >
        <CustomText stylearr={[20, 32, 700]} textAlign={"center"}>
          Are you sure you want to delete {policyName}?
        </CustomText>

        <Flex className="flex-row gap-4">
          <CustomButton variant="secondary" w={"50%"} onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton w={"50%"} onClick={onDelete}>
            Yes
          </CustomButton>
        </Flex>
      </motion.div>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
