import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import CustomModal from "../../../../../../components/common/CustomModal";
import ProgressBar from "../../../../../../components/common/ProgressBar";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../../../EventBus";

export const EVENT_OPEN_GENERATE_QUESTIONS_POLLING =
  "EVENT_OPEN_GENERATE_QUESTIONS_POLLING";
export const EVENT_CLOSE_GENERATE_QUESTIONS_POLLING =
  "EVENT_CLOSE_GENERATE_QUESTIONS_POLLING";

export default function GenerateQuestionsProcessingModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_GENERATE_QUESTIONS_POLLING,
      onOpen
    );
    EventBus.getInstance().addListener(
      EVENT_CLOSE_GENERATE_QUESTIONS_POLLING,
      onClose
    );
    return () => {
      EventBus.getInstance().removeListener(onOpen);
      EventBus.getInstance().removeListener(onClose);
    };
  }, []);
  return (
    <CustomModal
      w={"404px"}
      className="rounded-[16px] bg-white p-6 flex flex-col gap-6 text-center"
      isOpen={isOpen}
      onClose={() => {}}
    >
      <Flex className="flex-col">
        <CustomText stylearr={[18, 28, 700]}>Please wait while</CustomText>
        <CustomText stylearr={[18, 28, 700]}>
          we create your assessment...
        </CustomText>
      </Flex>

      <ProgressBar />
      <CustomText stylearr={[18, 28, 400]}>
        It might take 1 - 2 minutes...
      </CustomText>
    </CustomModal>
  );
}
