import { Flex } from "@chakra-ui/react";
import CustomModal from "../../../../common/CustomModal";
import ProgressBar from "../../../../common/ProgressBar";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const ProcessingModal = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <CustomModal
      w={"400px"}
      borderRadius={"16px"}
      isOpen={isOpen}
      onClose={() => {}}
      position={"absolute"}
      left={"55%"}
      top={"52%"}
    >
      <Flex className="flex-col gap-5 p-6 justify-center text-center">
        <CustomText stylearr={[18, 28, 700]}>
          Variable mapping in progress
        </CustomText>
        <ProgressBar />
        <CustomText stylearr={[14, 18, 400]}>
          Please wait while we map the imported variables. This might take
          around 30 seconds.
        </CustomText>
      </Flex>
    </CustomModal>
  );
};

export default ProcessingModal;
