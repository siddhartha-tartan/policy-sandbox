import { useDisclosure } from "@chakra-ui/hooks";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import EventBus from "../../../../EventBus";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../CustomModal";
import ProgressBar from "../../ProgressBar";

export const EVENT_OPEN_COMPARE_PROCESSING_MODAL =
  "EVENT_OPEN_COMPARE_PROCESSING_MODAL";
export const EVENT_CLOSE_COMPARE_PROCESSING_MODAL =
  "EVENT_CLOSE_COMPARE_PROCESSING_MODAL";
export default function ComparisonProcessingModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_COMPARE_PROCESSING_MODAL,
      onOpen
    );
    EventBus.getInstance().addListener(
      EVENT_CLOSE_COMPARE_PROCESSING_MODAL,
      onClose
    );
    return () => {
      EventBus.getInstance().removeListener(onOpen);
      EventBus.getInstance().removeListener(onClose);
    };
  }, []);

  return (
    <CustomModal
      w={"372px"}
      isOpen={isOpen}
      onClose={() => {}}
      position={"absolute"}
      left={"55%"}
      top={"52%"}
    >
      <Flex className="rounded-[16px] bg-white py-[27px] px-[24px] gap-6 justify-center items-center flex-col">
        <Flex className="flex-col gap-3 text-center">
          {" "}
          <CustomText stylearr={[20, 28, 600]}>
            Version comparison in progress
          </CustomText>
          <CustomText stylearr={[16, 20, 500]}>
            It might take a few seconds
          </CustomText>
        </Flex>
        <ProgressBar />
      </Flex>
    </CustomModal>
  );
}
