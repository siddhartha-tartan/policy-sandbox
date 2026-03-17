import { useDisclosure } from "@chakra-ui/hooks";
import { CloseButton, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import EventBus from "../../EventBus";
import CustomText from "../DesignSystem/Typography/CustomText";
import CustomModal from "./CustomModal";

export const EVENT_OPEN_POLICY_USAGE = "EVENT_OPEN_POLICY_USAGE";

export default function PolicyUsageModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_POLICY_USAGE, onOpen);

    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  return (
    <CustomModal
      w={"572px"}
      borderRadius={"16px"}
      isOpen={isOpen}
      onClose={() => {}}
    >
      <Flex className="rounded-[16px] bg-white p-6 gap-5 w-full flex-col">
        <Flex className="flex-row justify-between w-full">
          <CustomText stylearr={[20, 28, 700]}> Data Usage Policy</CustomText>
          <CloseButton onClick={onClose} />
        </Flex>

        <CustomText stylearr={[15, 24, 500]} className="text-justify">
          Your personal identifiable information (PII) is securely stored and
          used solely to enhance your experience and enable the functionality of
          this application. We do not share your data with third parties without
          your consent.
        </CustomText>
      </Flex>
    </CustomModal>
  );
}
