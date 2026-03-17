import { CloseIcon } from "@chakra-ui/icons";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Trash } from "react-huge-icons/outline";
import EventBus from "../../../../../../EventBus";
import CustomModal from "../../../../../common/CustomModal";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";

export const EVENT_DELETE_RULE = "EVENT_DELETE_RULE";

export default function DeleteRuleConfirmModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef<null | (() => void)>(null);
  useEffect(() => {
    const openModal = (e: any) => {
      ref.current = e;
      onOpen();
    };
    EventBus.getInstance().addListener(EVENT_DELETE_RULE, openModal);
    return () => EventBus.getInstance().removeListener(openModal);
  }, []);

  return (
    <CustomModal
      w={"472px"}
      className="rounded-[16px] bg-white flex flex-col p-6 gap-[42px] z-[10000000] shadow-md"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex className="gap-3 flex-col">
        <CustomText stylearr={[20, 24, 800]} className="text-center">
          Are you sure you want to delete the rule?
        </CustomText>
        <CustomText stylearr={[16, 24, 500]} className="text-center">
          Deleting this rule would remove it from Rules, Code and Summary.
        </CustomText>
      </Flex>
      <Flex className="w-full gap-6">
        <CustomButton
          variant="secondary"
          color={"#3762DD"}
          className="flex-1"
          border={"1px solid #3762DD"}
          onClick={onClose}
        >
          <Flex className="items-center gap-2">
            <CloseIcon fontSize={"10px"} />
            <CustomText stylearr={[14, 20, 600]}>No, Keep it</CustomText>
          </Flex>
        </CustomButton>
        <CustomButton
          style={{
            background: "#BF360C",
          }}
          h={"47px"}
          onClick={() => {
            ref.current?.();
            onClose();
          }}
          className="flex-1"
        >
          <Flex className="items-center gap-2">
            <Trash width="16px" />
            <CustomText stylearr={[14, 20, 600]}>Yes, Delete</CustomText>
          </Flex>
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
