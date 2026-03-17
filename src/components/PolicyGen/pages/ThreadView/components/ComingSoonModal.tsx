import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import EventBus from "../../../../../EventBus";
import CustomModal from "../../../../common/CustomModal";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

export const EVENT_OPEN_COMING_SOON_MODAL = "EVENT_OPEN_COMING_SOON_MODAL";

export default function ComingSoonModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_COMING_SOON_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  return (
    <CustomModal
      w={"472px"}
      className="rounded-[16px] bg-white px-[24px] py-[27px] flex flex-col gap-[42px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex className="gap-3 flex-col">
        <CustomText stylearr={[20, 24, 800]} className="text-center">
          Coming Soon
        </CustomText>
        <CustomText stylearr={[16, 24, 500]} className="text-center">
          This feature is currently under development. Stay tuned for updates!
        </CustomText>
      </Flex>
      <Flex className="w-full gap-6">
        <CustomButton
          variant="secondary"
          color={"#3762DD"}
          className="flex-1"
          border={"1px solid #3762DD"}
          onClick={() => {
            onClose();
          }}
        >
          <Flex className="items-center gap-2">
            <ChevronLeftIcon fontSize={"25px"} />
            <CustomText stylearr={[14, 20, 600]}>Go Back</CustomText>
          </Flex>
        </CustomButton>
        <CustomButton
          style={{
            background: `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
          }}
          h={"47px"}
          onClick={onClose}
          className="flex-1"
        >
          <Flex className="items-center gap-2">
            <CustomText stylearr={[14, 20, 600]}>Close</CustomText>
          </Flex>
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
