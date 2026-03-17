import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { useAtomValue } from "jotai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import EventBus from "../../../../../EventBus";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { queryClient } from "../../../../../ProviderWrapper";
import { userStore } from "../../../../../store/userStore";
import {
  POLICY_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import useDeleteBulkPolicies from "../../../../Polycraft/pages/Policies/hooks/useDeleteBulkPolicies";
import EditAction from "../../../Actions/EditAction";
import ViewAction from "../../../Actions/ViewAction";
import {
  getPoliciesByCategoryEndpoint,
  PolicyItem,
} from "../../hooks/useGetPolicyByCategory";
import { selectAllAtom, selectedPolicyAtom, selectedRowIdsAtom } from "../atom";
import useArchiveAction from "./ArchiveAction";
import { EVENT_OPEN_ARCHIVE_CONFIRMATION } from "./ArchiveConfirmationModal";
import useDeactivateAction from "./DeactivateAction";
import useDeleteAction from "./DeleteAction";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import useDownloadAction from "./DownloadAction";
import { getHrPortalColorConfig } from "../../../../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../../../../utils/constants/endpoints";

export enum PolicyStatus {
  ACTIVE = "active",
  DEACTIVATE = "deactivated",
}

export default function Action({ row }: { row: Row<PolicyItem> }) {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const navigate = useNavigate();
  const { id: categoryId } = useParams<{ id: string }>();
  const selectedPolicy = useAtomValue(selectedPolicyAtom);
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);
  const selectAll = useAtomValue(selectAllAtom);
  const { editableLoanCategories } = userStore();

  const userType: UserType = useGetUserType();
  const isSpoc =
    userType === UserType.SPOC &&
    editableLoanCategories?.some(
      (category) => category?.id === row.original.loan_category_id
    );
  const id: string = row?.getValue("id");
  const policyStatus = row.original.status === PolicyStatus.ACTIVE;

  const { mutate: deletePolicy } = useDeleteBulkPolicies();

  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure();
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();
  const isDisabled =
    selectAll ||
    (selectedRowIds?.size
      ? !(selectedRowIds.size === 1 && selectedRowIds.has(selectedPolicy?.id!))
      : false);

  const archiveAction = useArchiveAction(row.original, () => {
    EventBus.getInstance().fireEvent(EVENT_OPEN_ARCHIVE_CONFIRMATION);
    onPopoverClose();
  });
  const deactivateAction = useDeactivateAction(
    policyStatus,
    categoryId!,
    id,
    onPopoverClose
  );
  const deleteAction = useDeleteAction(() => {
    onPopoverClose();
    onDeleteConfirmationOpen();
  });
  const downloadAction = useDownloadAction({
    categoryId: categoryId!,
    policyId: row.original.id,
    fileId: row.original.policy_file?.id,
    fileName: row.original.policy_file?.file_name,
    onSuccess: onPopoverClose,
  });

  const handleDelete = () => {
    deletePolicy(
      { select_all: false, policy_ids: [row.original.id] },
      {
        onSuccess() {
          queryClient.refetchQueries(getPoliciesByCategoryEndpoint);
          onDeleteConfirmationClose();
        },
      }
    );
  };

  const actions = [
    ...(userType === UserType.ADMIN
      ? [downloadAction, deleteAction, deactivateAction, archiveAction]
      : []),
    ...(isSpoc
      ? [
          {
            icon: <EditAction />,
            title: "Edit",
            onClick: () =>
              navigate(`${POLICY_ROUTES[userType]}/${categoryId}/edit/${id}`),
          },
          deactivateAction,
          archiveAction,
        ]
      : []),
  ];

  return (
    <Flex gap="12px" justifyContent="flex-end" alignItems="center">
      <ViewAction
        opacity={isDisabled ? 0.4 : 1}
        cursor={isDisabled ? "not-allowed" : "auto"}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
          } else {
            navigate(`${POLICY_ROUTES[userType]}/${categoryId}/detail/${id}`);
          }
        }}
      />
      {actions?.length ? (
        <Popover
          placement="right-start"
          autoFocus={false}
          closeOnBlur
          isOpen={isPopoverOpen}
          onClose={onPopoverClose}
        >
          <PopoverTrigger>
            <Flex
              style={{
                background: IS_HR_PORTAL
                  ? hrPortalColorConfig.primary
                  : `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
              }}
              justifyContent="center"
              alignItems="center"
              w="30px"
              h="30px"
              borderRadius="8px"
              cursor={isDisabled ? "not-allowed" : "pointer"}
              opacity={isDisabled ? 0.4 : 1}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                } else {
                  onPopoverOpen();
                }
              }}
            >
              <BsThreeDotsVertical style={{ fontSize: "16px" }} color="#fff" />
            </Flex>
          </PopoverTrigger>
          <PopoverContent className="w-fit shadow-none border-none p-0 bg-transparent">
            <VStack
              divider={<StackDivider />}
              className="w-[213px] max-h-[300px] overflow-y-auto border bg-white shadow-md rounded-[12px] p-2 gap-2"
            >
              {actions?.map((action) => (
                <Flex
                  key={action.title}
                  onClick={() => {
                    if (action?.onClick) {
                      action?.onClick();
                    }
                  }}
                  className="py-[10px] px-3 hover:bg-[#F8F9FA] flex-row gap-3 transition-all items-center w-full cursor-pointer"
                >
                  {action.icon}
                  <CustomText stylearr={[12, 20, 500]} color="#37474F">
                    {action.title}
                  </CustomText>
                </Flex>
              ))}
            </VStack>
          </PopoverContent>
        </Popover>
      ) : null}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onDelete={handleDelete}
        onClose={onDeleteConfirmationClose}
        policyName={row.original.name || ""}
      />
    </Flex>
  );
}
