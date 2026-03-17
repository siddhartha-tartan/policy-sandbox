import { Button, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import DeleteSVG from "../../../../../assets/Icons/DeleteSVG";
import EventBus from "../../../../../EventBus";
import CustomModal from "../../../../common/CustomModal";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../atom";
import useDeleteBulkPolicies from "../hooks/useDeleteBulkPolicies";

export const EVENT_OPEN_POLICY_DELETE_MODAL = "EVENT_OPEN_POLICY_DELETE_MODAL";

const DeletePolicyConfirmationModal = ({
  search,
  categoryIds,
  policyManagers,
  status,
  selectedCount,
}: {
  search: string;
  categoryIds: Set<string>;
  policyManagers: Set<string>;
  status: Set<string>;
  selectedCount: number;
}) => {
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unselectedRowIds, setUnselectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useDeleteBulkPolicies();

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_POLICY_DELETE_MODAL, onOpen);
    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  const handleDelete = () => {
    mutate(
      {
        category_ids: Array.from(categoryIds),
        select_all: selectAll,
        policy_ids: selectAll
          ? Array.from(unselectedRowIds)
          : Array.from(selectedRowIds),
        policy_name: search,
        policy_manager: Array.from(policyManagers),
        policy_status: Array.from(status),
      },
      {
        onSuccess() {
          setSelectAll(false);
          setSelectedRowIds(new Set());
          setUnselectedRowIds(new Set());
          onClose();
        },
      }
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className="p-4 w-[360px] ">
      <div className="flex flex-col gap-5 w-full h-full justify-center items-center text-center">
        <div className="flex w-[56px] h-[56px] rounded-full bg-[#FFD8D4] items-center justify-center">
          <DeleteSVG />
        </div>
        <CustomText stylearr={[14, 18, 600]}>
          Are you sure you want to delete {selectedCount}{" "}
          {selectedCount === 1 ? "policy" : "policies"}?
        </CustomText>
        <CustomText stylearr={[12, 18, 400]} color={"#555557"} w={"80%"}>
          This action cannot be undone. Deleting this policy will permanently
          remove it.
        </CustomText>
        <div className="flex flex-row gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="border text-[#555557] h-10 rounded-lg bg-white py-2.5 px-5 grow"
          >
            No, Cancel
          </Button>{" "}
          <Button
            onClick={handleDelete}
            colorScheme="red"
            variant="outline"
            size="sm"
            isLoading={isLoading}
            isDisabled={isLoading}
            className="border-[#FFD8D4] h-10 rounded-lg bg-[#FFD8D433] py-2.5 px-5 grow"
          >
            Yes, Delete
          </Button>{" "}
        </div>
      </div>
    </CustomModal>
  );
};

export default DeletePolicyConfirmationModal;
