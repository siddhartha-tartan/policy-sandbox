import { Flex, Switch, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useRef } from "react";
import { Edit } from "react-huge-icons/solid";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../../../../hooks/useGetUserType";
import { userStore } from "../../../../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../../../../utils/constants/constants";
import { formatDateString } from "../../../../../../../../utils/helpers/formatDate";
import CustomText from "../../../../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../../../../CustomTable";
import Pagination from "../../../../../../Pagination";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../../../utils/constant";
import { WORKFLOW_SUB_ROUTES } from "../../../constant";
import { IWorkFlow } from "../../../hooks/useGetWorkFlows";
import useUpdateWorkFlowStatus from "../../../hooks/useUpdateWorkFlowStatus";
import { getLoanCategoryTypeById } from "../../../../../../../../utils/helpers/loanCategoryHelpers";

const WorkFlowTable = ({
  data,
  pageSize,
  setPageSize,
  page,
  setPage,
  totalPages,
  totalCount,
}: {
  data: IWorkFlow[];
  pageSize: number;
  setPageSize: (e: number) => void;
  page: number;
  setPage: (e: number) => void;
  totalPages: number;
  totalCount: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mutate: updateStatus } = useUpdateWorkFlowStatus();
  const navigate = useNavigate();
  const userType = useGetUserType();
  const { loanCategories } = userStore();
  const columns: ColumnDef<IWorkFlow>[] = [
    {
      accessorKey: "name",
      header: "Workflow Name",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <Text
            className="pl-2 cursor-pointer"
            bgGradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
            bgClip="text"
            fontSize="13px"
            lineHeight={"20px"}
            fontWeight={700}
            onClick={() =>
              navigate(
                `${BASE_ROUTES[userType]}/maker-checker/${
                  MAKER_CHECKER_SUB_ROUTES.WORKFLOW
                }/${WORKFLOW_SUB_ROUTES.EDIT.replace(":id", row.original.id)}`
              )
            }
          >
            {row.getValue("name")}
          </Text>
        );
      },
    },
    {
      accessorKey: "modules",
      header: "Milestones",
      enableSorting: false,
      size: 175,
      cell: ({ row }) => {
        const value: any[] = row.getValue("modules");
        return (
          <CustomText stylearr={[13, 20, 500]} color={"#607D8B"}>
            {value?.map((module) => module?.module_name).join(", ") || ""}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "entity_types",
      header: "Category",
      enableSorting: false,
      size: 175,
      cell: ({ row }) => {
        const value: any[] = row.original?.config?.entity_types?.map(
          (item) => getLoanCategoryTypeById(item, loanCategories) || "-"
        );
        return (
          <CustomText stylearr={[13, 20, 500]} color={"#607D8B"}>
            {value?.map((module) => module).join(", ") || ""}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created on",
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
      accessorKey: "levels_count",
      header: "Levels",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[13, 20, 500]} color={"#607D8B"}>
            {`${row.getValue("levels_count")}(${
              row.original.user_count
            } Users)`}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const value: boolean = row.getValue("is_active");
        return (
          <div
            className={`flex flex-row gap-[2px] items-center text-sm font-semibold ${
              value ? "text-[#4CAF50]" : "text-[#F04438]"
            }`}
          >
            <BsDot fontSize={"20px"} />
            <Text>{value ? "Active" : "InActive"}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <div className="flex flex-row gap-[10px] items-center">
            <div
              className="w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer 
             bg-[linear-gradient(95deg,_#3762DD_-1.14%,_#1D3577_158.31%)]
             transition-all duration-300 ease-in-out 
             hover:bg-[linear-gradient(95deg,_#1D3577_-1.14%,_#3762DD_158.31%)]
             hover:scale-110"
              onClick={() =>
                navigate(
                  `${BASE_ROUTES[userType]}/maker-checker/${
                    MAKER_CHECKER_SUB_ROUTES.WORKFLOW
                  }/${WORKFLOW_SUB_ROUTES.EDIT.replace(":id", row.original.id)}`
                )
              }
            >
              <Edit className="text-white text-[16px]" />
            </div>
            <Switch
              size="md"
              colorScheme="blue"
              isChecked={isActive}
              onChange={() =>
                updateStatus({ id: row.original.id, is_active: !isActive })
              }
            />
          </div>
        );
      },
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
    </Flex>
  );
};

export default WorkFlowTable;
