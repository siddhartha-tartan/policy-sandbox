import { Flex, Text } from "@chakra-ui/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRef } from "react";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import { formatDateString } from "../../../../../../utils/helpers/formatDate";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../../CustomTable";
import Pagination from "../../../../Pagination";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../utils/constant";
import { IApprovalRequest } from "../hooks/useGetApprovalRequests";
import ApprovalRejectModal from "./ApprovalRejectModal";
import ApprovalTableAction from "./ApprovalTableAction";

const PriorityMapper: Record<string, string> = {
  HIGH: "#E64A19",
  MEDIUM: "#F9A825",
  LOW: "#4CAF50",
};

const StatusMapper: Record<string, string> = {
  CANCELLED: "#E64A19",
  IN_PROGRESS: "#F9A825",
  APPROVED: "#4CAF50",
};

const ApprovalsTable = ({
  data,
  pageSize,
  setPageSize,
  page,
  setPage,
  totalPages,
  isAuditTrailTable = false,
  totalCount,
}: {
  data: IApprovalRequest[];
  pageSize: number;
  setPageSize: (e: number) => void;
  page: number;
  setPage: (e: number) => void;
  totalPages: number;
  isAuditTrailTable?: boolean;
  totalCount: number;
}) => {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const containerRef = useRef<HTMLDivElement>(null);
  const columns: ColumnDef<IApprovalRequest>[] = [
    {
      accessorKey: "entity_data",
      header: "Request Name",
      enableSorting: false,
      size: 175,
      cell: ({ row }) => {
        return (
          <Text
            className="pl-2 cursor-pointer"
            bgGradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
            bgClip="text"
            fontSize="14px"
            lineHeight={"20px"}
            fontWeight={700}
            onClick={() =>
              isAuditTrailTable
                ? navigate(
                    `${
                      BASE_ROUTES[userType]
                    }/maker-checker/${MAKER_CHECKER_SUB_ROUTES.AUDIT_TRAIL_DETAIL?.replace(
                      ":id",
                      row.original.request_id
                    )}`
                  )
                : navigate(
                    `${
                      BASE_ROUTES[userType]
                    }/maker-checker/${MAKER_CHECKER_SUB_ROUTES.TIMELINE?.replace(
                      ":id",
                      row.original.request_id
                    )}`
                  )
            }
          >
            {row.original?.entity_data?.policy_name || ""}
          </Text>
        );
      },
    },
    {
      accessorKey: "event_type",
      header: "Request Type",
      enableSorting: false,
      cell: ({ row }) => {
        const value =
          row.original?.entity_data?.event_type === "NEW_REQUEST"
            ? "Policy Upload"
            : "Policy Modification";
        return (
          <CustomText stylearr={[13, 20, 500]} color={"#607D8B"}>
            {value}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Requested on",
      enableSorting: false,
      cell: ({ row }) => {
        const value: string = row.getValue("created_at");
        return (
          <CustomText stylearr={[13, 20, 500]} color={"#607D8B"}>
            {value ? formatDateString(new Date(value)) : "-"}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      enableSorting: false,
      cell: ({ row }) => {
        const value: string = row.getValue("priority");
        return value ? (
          <div
            className={`flex flex-row gap-[2px] items-center text-sm font-semibold`}
            style={{ color: PriorityMapper[value?.toUpperCase()] || "#4CAF50" }}
          >
            <BsDot fontSize={"20px"} />
            <Text>
              {value?.charAt(0)?.toUpperCase() + value?.slice(1)?.toLowerCase()}
            </Text>
          </div>
        ) : null;
      },
    },
    ...(isAuditTrailTable
      ? [
          {
            accessorKey: "status",
            header: "Status",
            enableSorting: false,
            size: 200,
            cell: ({ row }: { row: Row<IApprovalRequest> }) => {
              const val: string = row.getValue("status");
              const props = {
                color: StatusMapper?.[val] || "#4CAF50",
              };
              const formatValue = val
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ");
              return (
                <div
                  className="flex flex-row gap-[2px] items-center text-sm font-semibold"
                  {...props}
                >
                  <BsDot fontSize={"20px"} {...props} />
                  <Text {...props}>
                    {formatValue + " at " + "L " + row.original?.current_level}
                  </Text>
                </div>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: "maker_name",
      header: "Requested By",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[13, 20, 500]} color={"#607D8B"}>
            {row.getValue("maker_name")}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      size: isAuditTrailTable ? 1 : 200,
      cell: ({ row }) => (
        <>
          <ApprovalTableAction
            data={row.original}
            isAuditTrailTable={isAuditTrailTable}
          />
        </>
      ),
    },
  ];
  return (
    <Flex className="w-full grow flex-col overflow-y-auto" ref={containerRef}>
      <CustomTable
        columns={columns}
        data={data}
        stickyHeader={true}
        lastAlignRight={false}
      />

      <Pagination
        page={page}
        setPage={(e) => {
          if (e != page) {
            containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }
          setPage(e);
        }}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={totalCount}
      />
      <ApprovalRejectModal />
    </Flex>
  );
};

export default ApprovalsTable;
