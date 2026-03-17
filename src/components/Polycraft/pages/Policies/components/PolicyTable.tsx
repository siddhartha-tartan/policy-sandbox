import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ColumnDef,
  Table as ReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EyeOffIconSVG from "../../../../../assets/Icons/EyeOffIconSVG";
import PencilSVG from "../../../../../assets/Icons/PencilSvg";
import ToggleVisibilitySVG from "../../../../../assets/Icons/ToggleVisibility";
import { userStore } from "../../../../../store/userStore";
import {
  BASE_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import { formatDateString } from "../../../../../utils/helpers/formatDate";
import { getPolicyFinalStatus } from "../../../../../utils/helpers/policyStatusHelper";
import CustomCheckbox from "../../../../CustomCheckbox";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import ViewAction from "../../../../common/Actions/ViewAction";
import CustomTable from "../../../../common/CustomTable";
import GradientText from "../../../../common/GradientText/GradientText";
import Pagination from "../../../../common/Pagination";
import Status from "../../../../common/Status";
import { POLYCRAFT_SUB_ROUTES } from "../../../constants";
import { Policy, PolicyData } from "../../../hooks/useGetPolicies";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../atom";
import { ColumnConfig, PolicyTableColumnConfig } from "../utils/config";
import { VersionCell } from "./VersionCell";

// Define PolicyStatus type to fix type errors
type PolicyStatus =
  | "active"
  | "deactivated"
  | "drafted"
  | "deleted"
  | "rejected"
  | "approved"
  | "In-Review";

// Create a separate component for column header to improve reusability and readability
const ColumnHeader = React.memo(
  ({
    title,
    columnId,
    isVisible,
    isMandatory,
    onToggle,
    extraComponent = null,
  }: {
    title: string;
    columnId: string;
    isVisible: boolean;
    isMandatory: boolean;
    onToggle: (columnId: string) => void;
    extraComponent?: React.ReactNode;
  }) => {
    const handleToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(columnId);
      },
      [columnId, onToggle]
    );

    return (
      <Flex alignItems="center" className="group cursor-default max-w-[100px]">
        {extraComponent}
        <CustomText
          stylearr={[12, 19, 700]}
          color="#607D8B"
          textTransform="capitalize"
        >
          {title}
        </CustomText>
        {!isMandatory && (
          <IconButton
            aria-label="Toggle visibility"
            icon={isVisible ? <EyeOffIconSVG /> : <FiEye size={14} />}
            size="xs"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100"
            onClick={handleToggle}
          />
        )}
      </Flex>
    );
  }
);

// Create separate component for column settings menu
const ColumnSettingsMenu = React.memo(
  ({
    columnConfig,
    toggleColumnVisibility,
  }: {
    columnConfig: ColumnConfig[];
    toggleColumnVisibility: (columnId: string) => void;
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <Menu closeOnSelect={false} isOpen={isOpen} onClose={onClose}>
        <MenuButton
          as={IconButton}
          aria-label="Column settings"
          icon={<ToggleVisibilitySVG />}
          size="xs"
          variant="ghost"
          onClick={onOpen}
        />
        <Portal>
          <MenuList
            minWidth="280px"
            p={4}
            boxShadow="0px 4px 25px rgba(0, 0, 0, 0.15)"
            borderRadius="12px"
            border="1px solid #E5E6E6"
          >
            <Box mb={2}>
              <CustomText stylearr={[14, 20, 600]} color="#000" mb={2}>
                Column Settings
              </CustomText>
            </Box>
            {columnConfig.map((col) => (
              <MenuItem key={col.id} py={2} px={0}>
                <Flex
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <CustomText stylearr={[14, 20, 500]} color="#555557">
                    {col.title}
                  </CustomText>
                  <Flex alignItems="center">
                    {col.isMandatory ? (
                      <CustomText
                        stylearr={[12, 16, 500]}
                        color="#607D8B"
                        mr={2}
                      >
                        Mandatory
                      </CustomText>
                    ) : (
                      <Switch
                        size="sm"
                        isChecked={col.isVisible}
                        onChange={() => toggleColumnVisibility(col.id)}
                        colorScheme="blue"
                      />
                    )}
                  </Flex>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Portal>
      </Menu>
    );
  }
);

// Create a component for action buttons
const ActionButtons = React.memo(
  ({
    policyId,
    loanCategoryId,
  }: {
    policyId: string;
    loanCategoryId: string;
  }) => {
    const navigate = useNavigate();
    const { userType } = userStore();

    const handleViewClick = useCallback(() => {
      navigate(
        BASE_ROUTES[userType] +
          "/polycraft/" +
          POLYCRAFT_SUB_ROUTES.VIEW_POLICY.replace(":id", policyId).replace(
            ":categoryId",
            loanCategoryId
          )
      );
    }, [policyId, loanCategoryId, navigate, userType]);

    const handleEdit = useCallback(() => {
      navigate(
        BASE_ROUTES[userType] +
          "/polycraft/" +
          POLYCRAFT_SUB_ROUTES.EDIT_POLICY.replace(":id", policyId).replace(
            ":categoryId",
            loanCategoryId
          )
      );
    }, [policyId, loanCategoryId, navigate, userType]);

    return (
      <Flex gap="12px" justifyContent="flex-end" alignItems="center">
        <ViewAction cursor="pointer" onClick={handleViewClick} />
        <div
          className="cursor-pointer rounded-lg bg-[#2F78EE] flex items-center justify-center min-w-[30px] h-[30px] w-[30px]"
          onClick={handleEdit}
        >
          <PencilSVG fontSize="16px" className="text-white" />
        </div>
      </Flex>
    );
  }
);

export default function PolicyTable({
  data,
  setPageSize,
  pageSize,
  page,
  setPage,
}: {
  data: PolicyData;
  setPageSize: (e: number) => void;
  pageSize: number;
  setPage: (e: number) => void;
  page: number;
}) {
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, setUnSelectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const { userType } = userStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Column config state
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(
    PolicyTableColumnConfig
  );

  // Column toggle handler - optimized to avoid unnecessary re-renders
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnConfig((prev) =>
      prev.map((col) =>
        col.id === columnId && !col.isMandatory
          ? { ...col, isVisible: !col.isVisible }
          : col
      )
    );
  }, []);

  const columnHelper = useMemo(() => createColumnHelper<Policy>(), []);

  // Define all columns with memoized cell renderers to prevent re-renders
  const allColumns = useMemo<ColumnDef<Policy>[]>(() => {
    return [
      ...(userType === UserType.ADMIN
        ? [
            {
              id: "selection",
              size: 1,
              header: ({ table }: { table: ReactTable<Policy> }) => (
                <CustomCheckbox
                  isChecked={table.getIsAllRowsSelected()}
                  setIsChecked={(e) =>
                    table.getToggleAllRowsSelectedHandler()(e)
                  }
                />
              ),
            },
          ]
        : []),
      columnHelper.accessor("policy_name", {
        id: "policy_name",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "policy_name");
          return (
            <ColumnHeader
              title="Policy Name"
              columnId="policy_name"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },
        cell: ({ row }) => {
          const handleClick = () => {
            navigate(
              BASE_ROUTES[userType] +
                "/polycraft/" +
                POLYCRAFT_SUB_ROUTES.VIEW_POLICY.replace(
                  ":id",
                  row?.original?.id
                ).replace(
                  ":categoryId",
                  row.original?.subcategory_id ||
                    row?.original?.loan_category_id
                )
            );
          };

          return (
            <Flex alignItems="center" gap={2}>
              <GradientText
                text={row.getValue("policy_name")}
                gradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                className="text-xs font-semibold font-[Manrope] cursor-pointer"
                onClick={handleClick}
              />
            </Flex>
          );
        },
        enableSorting: false,
      }),

      columnHelper.accessor("created_by", {
        id: "created_by",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "created_by");
          return (
            <ColumnHeader
              title="Policy Owner"
              columnId="created_by"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },
        cell: ({ row }) => (
          <CustomText
            stylearr={[14, 20, 500]}
            color={"#607D8B"}
            className="text-xs font-normal text-[#555557] font-[Manrope]"
            maxW={"100px"}
            title={row.getValue("created_by")}
            isTruncated
          >
            {row.getValue("created_by")}
          </CustomText>
        ),
        enableSorting: false,
      }),

      // Category column
      columnHelper.accessor("loan_category_name", {
        id: "loan_category_name",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "loan_category_name");
          return (
            <ColumnHeader
              title="Category"
              columnId="loan_category_name"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },

        cell: ({ row }) => {
          const value: string = row.getValue("loan_category_name");
          return (
            <CustomText
              stylearr={[14, 20, 500]}
              className="text-xs font-semibold text-[#607D8B]"
              maxW={"100px"}
              title={value}
              isTruncated
            >
              {value || "N/A"}
            </CustomText>
          );
        },
        enableSorting: false,
      }),

      columnHelper.accessor("subcategory_name", {
        id: "subcategory_name",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "subcategory_name");
          return (
            <ColumnHeader
              title="Sub Category"
              columnId="subcategory_name"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },

        cell: ({ row }) => {
          const value: string = row.getValue("subcategory_name");
          return (
            <CustomText
              stylearr={[14, 20, 500]}
              className="text-xs font-semibold text-[#607D8B]"
              maxW={"100px"}
              title={value}
              isTruncated
            >
              {value || "N/A"}
            </CustomText>
          );
        },
        enableSorting: false,
      }),

      // Status column
      columnHelper.accessor((row) => row.status as PolicyStatus, {
        id: "status",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "status");
          return (
            <ColumnHeader
              title="Status"
              columnId="status"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },
        cell: ({ row }) => {
          const policy = row.original;
          const finalStatus = getPolicyFinalStatus(policy);
          
          return (
            <Status w={"100px"} minW={"100px"} status={finalStatus} />
          );
        },
        enableSorting: false,
      }),

      // Created at column
      columnHelper.accessor("created_at", {
        id: "created_at",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "created_at");
          return (
            <ColumnHeader
              title="Created on"
              columnId="created_at"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },
        cell: ({ row }) => {
          const value: string = row.getValue("created_at");
          return (
            <CustomText
              stylearr={[14, 20, 500]}
              color={"#607D8B"}
              maxW={"100px"}
              title={value}
              isTruncated
              className="text-xs font-normal text-[#555557] font-[Manrope]"
            >
              {value ? formatDateString(new Date(value)) : "-"}
            </CustomText>
          );
        },
      }),

      // Updated at column
      columnHelper.accessor("updated_at", {
        id: "updated_at",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "updated_at");
          return (
            <ColumnHeader
              title="Last modified on"
              columnId="updated_at"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },
        cell: ({ row }) => {
          const value: string = row.getValue("updated_at");
          return (
            <CustomText
              stylearr={[14, 20, 500]}
              color={"#607D8B"}
              maxW={"100px"}
              title={value}
              isTruncated
              className="text-xs font-normal text-[#555557] font-[Manrope]"
            >
              {value ? formatDateString(new Date(value)) : "-"}
            </CustomText>
          );
        },
      }),

      // Version column
      columnHelper.accessor("id", {
        id: "version",
        size: 1,
        header: () => {
          const col = columnConfig.find((c) => c.id === "version");
          return (
            <ColumnHeader
              title="Version"
              columnId="version"
              isVisible={col?.isVisible ?? true}
              isMandatory={col?.isMandatory ?? false}
              onToggle={toggleColumnVisibility}
            />
          );
        },
        cell: ({ row }) => {
          return <VersionCell policy={row.original} />;
        },
      }),

      // Actions column
      columnHelper.display({
        id: "actions",
        size: 1,
        header: () => {
          return (
            <Flex alignItems="center" justifyContent="flex-end">
              <CustomText
                stylearr={[12, 19, 700]}
                color="#607D8B"
                textTransform="capitalize"
              >
                Action
              </CustomText>
              <ColumnSettingsMenu
                columnConfig={columnConfig}
                toggleColumnVisibility={toggleColumnVisibility}
              />
            </Flex>
          );
        },
        cell: ({ row }) => (
          <ActionButtons
            policyId={row.original.id}
            loanCategoryId={
              row.original.subcategory_id || row.original.loan_category_id
            }
          />
        ),
        enableSorting: false,
      }),
    ] as ColumnDef<Policy>[];
  }, [columnConfig, toggleColumnVisibility, navigate, userType, columnHelper]);

  // Get visible columns based on current config - optimized with memoization
  const visibleColumns = useMemo(() => {
    return allColumns.filter((column) => {
      const colId = column.id || "";
      const colConfig = columnConfig.find((c) => c.id === colId);
      return colConfig?.isVisible ?? true;
    });
  }, [allColumns, columnConfig]);

  return (
    <Flex
      className="w-full bg-white grow border-[#E5E6E6] rounded-[16px] pb-2 flex-col overflow-y-auto"
      ref={containerRef}
      style={{ transition: "all 0.3s ease" }}
    >
      <CustomTable
        columns={visibleColumns}
        data={data?.data}
        highlightedRowClass="bg-white"
        stickyHeader={true}
        lastAlignRight={false}
        selectedRows={selectedRowIds}
        setSelectedRows={setSelectedRowIds}
        unSelectedRows={unSelectedRowIds}
        setUnSelectedRows={setUnSelectedRowIds}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />
      <Pagination
        page={page}
        setPage={(e) => {
          if (e != page) {
            containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }
          setPage(e);
        }}
        totalPages={data?.total_pages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={data?.policy_count}
      />
    </Flex>
  );
}
