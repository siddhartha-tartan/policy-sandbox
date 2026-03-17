import { useDisclosure } from "@chakra-ui/hooks";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import EventBus from "../../../../../EventBus";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../CustomModal";
import { useAtom, useAtomValue } from "jotai";
import {
  selectAllAtom,
  selectedPolicyAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../atom";
import useArchivePolicy from "../../hooks/useArchivePolicy";

export const EVENT_OPEN_ARCHIVE_CONFIRMATION =
  "EVENT_OPEN_ARCHIVE_CONFIRMATION";

export default function ArchiveConfirmationModal({
  categoryId,
}: {
  categoryId: string;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_ARCHIVE_CONFIRMATION, onOpen);

    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  const selectedPolicy = useAtomValue(selectedPolicyAtom);
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, setUnSelectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const { mutate } = useArchivePolicy();
  const payload = selectedPolicy
    ? {
        all_selected: false,
        policy_ids: [selectedPolicy?.id],
        categoryId: categoryId,
      }
    : {
        all_selected: selectAll,
        policy_ids: Array.from(selectAll ? unSelectedRowIds : selectedRowIds),
        categoryId: categoryId,
      };

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
          Do you want to archive{" "}
          {selectedPolicy ? selectedPolicy?.name : "multiple policies"} ?
        </CustomText>
        <Flex className="flex-row gap-4">
          <CustomButton variant="secondary" className="grow" onClick={onClose}>
            No
          </CustomButton>
          <CustomButton
            className="grow"
            onClick={() => {
              mutate(payload, {
                onSuccess() {
                  setSelectAll(false);
                  setSelectedRowIds(new Set<string>());
                  setUnSelectedRowIds(new Set<string>());
                  onClose();
                },
              });
            }}
          >
            Yes
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
