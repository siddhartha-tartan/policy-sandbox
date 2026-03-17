import { useDisclosure } from "@chakra-ui/hooks";
import { Flex } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import EventBus from "../../../../../EventBus";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../CustomModal";
import useRestorePolicy from "../../hooks/useRestorePolicy";
import { restorePolicyAtom } from "../atom";

export const EVENT_OPEN_RESTORE_CONFIRMATION =
  "EVENT_OPEN_RESTORE_CONFIRMATION";

export default function RestoreConfirmationModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const selectedPolicy = useAtomValue(restorePolicyAtom);
  const { mutate, isLoading } = useRestorePolicy();
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_RESTORE_CONFIRMATION, onOpen);

    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  return (
    <CustomModal
      w={"468px"}
      borderRadius={"16px"}
      isOpen={isOpen}
      onClose={() => {}}
    >
      <Flex className="rounded-[16px] bg-white p-6 gap-6 w-full flex-col">
        <CustomText
          stylearr={[24, 28, 700]}
          textAlign={"center"}
          wordBreak={"break-all"}
        >
          Do you want to restore{" "}
          {selectedPolicy ? selectedPolicy?.name : "multiple policies"} ?
        </CustomText>
        <Flex className="flex-row gap-4">
          <CustomButton variant="secondary" className="grow" onClick={onClose}>
            No
          </CustomButton>
          <CustomButton
            className="grow"
            isLoading={isLoading}
            isDisabled={isLoading || !selectedPolicy?.id}
            onClick={() => {
              mutate(
                {
                  policy_ids: [selectedPolicy?.id!],
                  categoryId: selectedPolicy?.category_id!,
                },
                {
                  onSuccess() {
                    onClose();
                  },
                }
              );
            }}
          >
            Yes
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
