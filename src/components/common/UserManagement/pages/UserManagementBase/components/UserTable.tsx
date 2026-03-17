import {
  Box,
  Divider,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { useAtom, useSetAtom } from "jotai";
import { useRef } from "react";
import EditIcon from "../../../../../../assets/Icons/EditIcon";
import EventBus from "../../../../../../EventBus";
import { formatDateString } from "../../../../../../utils/helpers/formatDate";
import { formatUserType } from "../../../../../../utils/helpers/formatUserType";
import CustomCheckbox from "../../../../../CustomCheckbox";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../../CustomTable";
import GradientText from "../../../../GradientText/GradientText";
import Pagination from "../../../../Pagination";
import Status, { StatusTypes } from "../../../../Status";
import {
  IUser,
  IUserCategoryAccess,
  IUserData,
} from "../../../hooks/useGetUsers";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../../../utils/atom";
import { selectedEditUserAtom } from "../utils/atom";
import EditUserDrawer, { EVENT_OPEN_EDIT_USER_DRAWER } from "./EditUserDrawer";
import { getHrPortalColorConfig } from "../../../../../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../../../../../utils/constants/endpoints";

export default function UserTable({
  data,
  page,
  setPage,
  pageSize,
  setPageSize,
}: {
  data: IUserData;
  page: number;
  setPage: (e: number) => void;
  pageSize: number;
  setPageSize: (e: number) => void;
}) {
  const hrportalColorConfig = getHrPortalColorConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, setUnSelectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const selectedEditUser = useSetAtom(selectedEditUserAtom);
  const columns: ColumnDef<IUser>[] = [
    ...(!IS_HR_PORTAL
      ? [
          {
            id: "selection",
            size: 1,
            header: ({ table }: { table: Table<IUser> }) => (
              <CustomCheckbox
                isChecked={table.getIsAllRowsSelected()}
                setIsChecked={(e) => table.getToggleAllRowsSelectedHandler()(e)}
              />
            ),
          } as ColumnDef<IUser>,
        ]
      : []),
    {
      accessorKey: "source_employee_id",
      header: "Employee ID",
      cell: ({ row }) => {
        return (
          <CustomText
            stylearr={[12, 16, 600]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
            title={row.getValue("source_employee_id")}
          >
            {row.getValue("source_employee_id")}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "first_name",
      header: "Employee Name",
      cell: ({ row }) => {
        return (
          <GradientText
            text={row.getValue("first_name")}
            gradient={
              IS_HR_PORTAL
                ? hrportalColorConfig.primary
                : "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
            }
            className="text-xs font-semibold max-w-[100px] truncate"
          />
        );
      },
    },
    {
      accessorKey: "user_type",
      header: "Role",
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            {formatUserType(row.getValue("user_type"))}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <CustomText
            stylearr={[12, 18, 400]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
            title={row.getValue("email")}
          >
            {row.getValue("email")}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const value =
          row.getValue("is_active") === true ? "Active" : "Inactive";
        return <Status minW={"80px"} status={value as StatusTypes} />;
      },
    },
    {
      accessorKey: "loan_category_access",
      header: "Product Category",
      size: 200,
      cell: ({ row }) => {
        const value = (row.getValue("loan_category_access") ||
          []) as IUserCategoryAccess[];

        return (
          <div className="flex flex-row gap-4">
            <div
              className="flex items-center h-[24px] px-4 py-1  rounded-[8px]"
              style={{
                background: IS_HR_PORTAL
                  ? hrportalColorConfig.secondary
                  : "bg-[linear-gradient(95deg,rgba(55,98,221,0.12)_-1.14%,rgba(29,53,119,0.12)_158.31%)]",
              }}
            >
              <CustomText
                stylearr={[12, 16, 600]}
                isTruncated
                style={{
                  background: IS_HR_PORTAL
                    ? hrportalColorConfig.primary
                    : "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value[0]?.loan_category_name || "N/A"}
              </CustomText>
            </div>

            {value?.length > 1 && (
              <Popover trigger="hover" placement="top" gutter={0} isLazy>
                <PopoverTrigger>
                  <div
                    className="flex items-center h-[24px] px-2 py-1 rounded-[8px]"
                    style={{
                      background: IS_HR_PORTAL
                        ? hrportalColorConfig.secondary
                        : "bg-[linear-gradient(95deg,rgba(55,98,221,0.12)_-1.14%,rgba(29,53,119,0.12)_158.31%)]",
                    }}
                  >
                    <CustomText
                      stylearr={[12, 16, 600]}
                      isTruncated
                      style={{
                        background: IS_HR_PORTAL
                          ? hrportalColorConfig.primary
                          : "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      +{value?.length - 1}{" "}
                    </CustomText>
                  </div>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent width="auto" boxShadow="md" borderRadius="md">
                    <PopoverBody p={0}>
                      <Box maxH="160px" overflowY="auto">
                        {value?.map((cat, index) => (
                          <Box key={index} position="relative">
                            <Box p={2} px={4}>
                              <Text
                                fontSize="12px"
                                lineHeight={"16px"}
                                fontWeight={500}
                                color="#141414"
                              >
                                {index + 1}. {cat?.loan_category_name}
                              </Text>
                            </Box>
                            <Divider />
                          </Box>
                        ))}
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date Added",
      cell: ({ row }) => {
        return (
          <CustomText
            stylearr={[12, 18, 400]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
          >
            {formatDateString(new Date(row.getValue("created_at")))}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "feature_ids",
      header: "AI Access",
      size: 1,
      cell: ({ row }) => {
        const aiAccess: string[] = row.getValue("feature_ids") || [];
        const value = aiAccess && aiAccess?.length ? "Yes" : "No";
        return (
          <CustomText stylearr={[12, 16, 600]} color={"#555557"}>
            {value}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Action",
      size: 1,
      cell: ({ row }: { row: any }) => {
        return (
          <div
            className="flex items-end justify-end cursor-pointer"
            onClick={() => {
              selectedEditUser(row.original);

              EventBus.getInstance().fireEvent(
                EVENT_OPEN_EDIT_USER_DRAWER,
                row.original
              );
            }}
          >
            {IS_HR_PORTAL ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  opacity="0.2"
                  d="M17.3172 7.55791L15 9.8751L10.625 5.5001L12.9422 3.18291C13.0594 3.06579 13.2183 3 13.384 3C13.5497 3 13.7086 3.06579 13.8258 3.18291L17.3172 6.67198C17.3755 6.73005 17.4218 6.79908 17.4534 6.8751C17.485 6.95111 17.5013 7.03262 17.5013 7.11494C17.5013 7.19727 17.485 7.27878 17.4534 7.35479C17.4218 7.43081 17.3755 7.49984 17.3172 7.55791Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  d="M17.7586 6.23262L14.268 2.74122C14.1519 2.62511 14.0141 2.53301 13.8624 2.47018C13.7107 2.40734 13.5482 2.375 13.384 2.375C13.2198 2.375 13.0572 2.40734 12.9056 2.47018C12.7539 2.53301 12.6161 2.62511 12.5 2.74122L2.86641 12.3756C2.74983 12.4912 2.65741 12.6289 2.59451 12.7806C2.5316 12.9323 2.49948 13.095 2.50001 13.2592V16.7506C2.50001 17.0821 2.6317 17.4001 2.86612 17.6345C3.10054 17.8689 3.41849 18.0006 3.75001 18.0006H7.24141C7.40563 18.0011 7.5683 17.969 7.71999 17.9061C7.87168 17.8432 8.00935 17.7508 8.12501 17.6342L17.7586 8.00059C17.8747 7.88452 17.9668 7.7467 18.0296 7.59503C18.0925 7.44335 18.1248 7.28078 18.1248 7.11661C18.1248 6.95243 18.0925 6.78986 18.0296 6.63819C17.9668 6.48651 17.8747 6.3487 17.7586 6.23262ZM4.0086 13.0006L10.625 6.38419L11.9289 7.68809L5.31251 14.3037L4.0086 13.0006ZM3.75001 14.5092L5.99141 16.7506H3.75001V14.5092ZM7.50001 16.492L6.1961 15.1881L12.8125 8.57169L14.1164 9.87559L7.50001 16.492ZM15 8.992L11.5086 5.50059L13.3836 3.62559L16.875 7.11622L15 8.992Z"
                  fill="url(#paint1_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="10.625"
                    y1="2.04513"
                    x2="22.4752"
                    y2="3.10511"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7D152B" />
                    <stop offset="1" stop-color="#B3475D" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="2.5"
                    y1="0.204779"
                    x2="29.4271"
                    y2="2.61283"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#7D152B" />
                    <stop offset="1" stop-color="#B3475D" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <EditIcon />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div
      className={`w-full rounded-[16px] flex flex-col gap-3 overflow-y-auto`}
      ref={containerRef}
    >
      <CustomTable
        columns={columns}
        lastAlignRight={true}
        data={data?.data}
        stickyHeader={true}
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
        totalCount={data?.user_count}
      />
      <EditUserDrawer />
    </div>
  );
}
