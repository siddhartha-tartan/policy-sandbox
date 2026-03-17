import { Divider, useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import EventBus from "../../../../../../EventBus";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../../CustomModal";
import { IUserData } from "../../../hooks/useGetUsers";
import useUpdateBulkUsers from "../../../hooks/useUpdateBulkUsers";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../../../utils/atom";
import FeatureAccessForm, {
  FeatureAccessData,
} from "../../AddUserManual/components/FeatureAccessForm";

export const EVENT_OPEN_BULK_EDIT_USER_MODAL =
  "EVENT_OPEN_BULK_EDIT_USER_MODAL";
export default function BulkEditUserModal({
  userData,
  selectedUsers,
  searchQuery,
  statusFilter,
  rolesFilter,
  categoriesFilter,
  aiAccess,
  startDateFilter,
  endDateFilter,
}: {
  userData: IUserData | null;
  selectedUsers: number;
  searchQuery: string;
  statusFilter: Set<boolean>;
  rolesFilter: Set<string>;
  categoriesFilter: Set<string>;
  aiAccess: Set<string>;
  startDateFilter: Date | null;
  endDateFilter: Date | null;
}) {
  if (!userData) return null;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, setUnselectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const [featureData, setFeatureData] = useState<FeatureAccessData>({
    feature_ids: [],
  });
  const { mutate, isLoading } = useUpdateBulkUsers(undefined, false);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_BULK_EDIT_USER_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  const handleSubmit = () => {
    mutate(
      {
        filters: {
          select_all: selectAll,
          exclude_user_ids: selectAll ? Array.from(unSelectedRowIds) || [] : [],
          user_ids: selectAll ? [] : Array.from(selectedRowIds) || [],
          category_ids: Array.from(categoriesFilter) || [],
          user_types: Array.from(rolesFilter) || [],
          ...(statusFilter?.size === 1 && {
            is_active: statusFilter.has(true) ? true : false,
          }),
          search_term: searchQuery,
          feature_ids: Array.from(aiAccess) || [],
          start_date: startDateFilter,
          end_date: endDateFilter,
        },
        global_feature_ids: featureData?.feature_ids || [],
      },
      {
        onSuccess() {
          onClose();
          setSelectAll(false);
          setSelectedRowIds(new Set());
          setUnselectedRowIds(new Set());
        },
      }
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {" "}
      <div className="flex flex-col w-[585px] rounded-[16px] p-6 gap-5 bg-white">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[20, 28, 500]}>Bulk Edit</CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              Editing {selectedUsers} selected Employees
            </CustomText>
          </div>
          <IoClose fontSize={"18px"} onClick={onClose} />
        </div>
        <Divider variant={"dashed"} borderWidth="1px" />
        <CustomText stylearr={[20, 28, 500]}>User Settings</CustomText>
        <div className="flex flex-col gap-2">
          <CustomText stylearr={[16, 20, 600]}>AI Feature Access</CustomText>
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            Manage special AI-powered capabilities assigned to the Employees
          </CustomText>
        </div>
        <FeatureAccessForm data={featureData} setData={setFeatureData} />
        <div className="flex flex-row gap-4 justify-end h-[40px]">
          <CustomButton
            variant={"secondary"}
            className="w-[160px] text-sm font-semibold"
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant={"quaternary"}
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={handleSubmit}
            className="w-[160px] text-sm font-semibold"
          >
            Save
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
