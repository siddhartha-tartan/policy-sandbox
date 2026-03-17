import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { Plus } from "react-huge-icons/solid";
import EventBus from "../../../../../../EventBus";
import CustomModal from "../../../../../common/CustomModal";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";

export const EVENT_ADD_RULE = "EVENT_ADD_RULE";

export default function AddRuleModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    const openModal = () => {
      onOpen();
    };
    EventBus.getInstance().addListener(EVENT_ADD_RULE, openModal);
    return () => EventBus.getInstance().removeListener(openModal);
  }, []);

  return (
    <CustomModal
      w={"472px"}
      className="rounded-[16px] bg-white flex flex-col p-6 gap-[42px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex className="gap-3 flex-col">
        <CustomText stylearr={[20, 24, 800]} className="text-center">
          Please add Rules to Generate Code
        </CustomText>
        <CustomText stylearr={[16, 24, 500]} className="text-center">
          There are no rules. Please add rules to generate code.
        </CustomText>
      </Flex>
      <Flex className="w-full gap-6">
        <CustomButton
          style={{
            background: `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
          }}
          h={"47px"}
          onClick={() => {
            onClose();
          }}
          className="flex-1"
        >
          <Flex className="items-center gap-2">
            <Plus width="16px" />
            <CustomText stylearr={[14, 20, 600]}>Add Rules</CustomText>
          </Flex>
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
