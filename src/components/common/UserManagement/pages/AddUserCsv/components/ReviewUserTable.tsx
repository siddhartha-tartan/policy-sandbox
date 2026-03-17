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
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { userStore } from "../../../../../../store/userStore";
import { formatUserType } from "../../../../../../utils/helpers/formatUserType";
import { getLoanCategoryTypeById } from "../../../../../../utils/helpers/loanCategoryHelpers";
import Pagination from "../../../../../common/Pagination";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../../CustomTable";
import GradientText from "../../../../GradientText/GradientText";
import { CsvParsedUser } from "../view";
import { isNullOrUndefined } from "../../../../../../utils/helpers/isNullorUndefined";

export default function ReviewUserTable({
  data,
  isEdit,
}: {
  data: CsvParsedUser[];
  isEdit: boolean;
}) {
  const { editableLoanCategories } = userStore((state) => state);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  const columns: ColumnDef<CsvParsedUser>[] = [
    {
      accessorKey: "source_employee_id",
      header: "Employee ID",
      cell: ({ row }) => {
        const value = row.original?.source_employee_id || "";
        return (
          <CustomText
            stylearr={[12, 16, 600]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
          >
            {value}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Employee Name",
      cell: ({ row }) => {
        const value = row.original?.name || "";
        return (
          <CustomText
            stylearr={[12, 16, 600]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
          >
            {value}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "user_type",
      header: "Role",
      cell: ({ row }) => {
        const value = row.original?.user_type || "";
        return (
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            {value ? formatUserType(value) : ""}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: "Mobile Number",
      cell: ({ row }) => {
        const value = row.original?.phone_number || "";
        return (
          <CustomText
            stylearr={[12, 18, 400]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
          >
            {value}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const value = row.original?.email || "";
        return (
          <CustomText
            stylearr={[12, 18, 400]}
            color={"#555557"}
            maxW={"100px"}
            isTruncated
          >
            {value}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "loan_category_id",
      header: "Product Category",
      size: 200,
      cell: ({ row }) => {
        const loanCategoriesSet: Set<string> = row.original.loan_category_id;
        const loanCategories =
          loanCategoriesSet && loanCategoriesSet?.size
            ? Array?.from(loanCategoriesSet)
            : [];

        return (
          <div className="flex flex-row gap-4">
            <div className="flex items-center h-[24px] px-4 py-1 bg-[linear-gradient(95deg,rgba(55,98,221,0.12)_-1.14%,rgba(29,53,119,0.12)_158.31%)] rounded-[8px]">
              <CustomText
                stylearr={[12, 16, 600]}
                isTruncated
                style={{
                  background:
                    "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {loanCategories.length > 0
                  ? getLoanCategoryTypeById(
                      loanCategories[0],
                      editableLoanCategories
                    ) || "N/A"
                  : "N/A"}
              </CustomText>
            </div>

            {loanCategories.length > 1 && (
              <Popover trigger="hover" placement="top" gutter={0} isLazy>
                <PopoverTrigger>
                  <div className="flex items-center h-[24px] px-2 py-1 bg-[linear-gradient(95deg,rgba(55,98,221,0.12)_-1.14%,rgba(29,53,119,0.12)_158.31%)] rounded-[8px]">
                    <CustomText
                      stylearr={[12, 16, 600]}
                      isTruncated
                      style={{
                        background:
                          "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      +{loanCategories.length - 1}{" "}
                    </CustomText>
                  </div>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent width="auto" boxShadow="md" borderRadius="md">
                    <PopoverBody p={0}>
                      <Box maxH="160px" overflowY="auto">
                        {loanCategories.map(
                          (categoryId: string, index: number) => (
                            <Box key={index} position="relative">
                              <Box p={2} px={4}>
                                <Text
                                  fontSize="12px"
                                  lineHeight={"16px"}
                                  fontWeight={500}
                                  color="#141414"
                                >
                                  {index + 1}.{" "}
                                  {getLoanCategoryTypeById(
                                    categoryId,
                                    editableLoanCategories
                                  )}
                                </Text>
                              </Box>
                              <Divider />
                            </Box>
                          )
                        )}
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
      accessorKey: "PolyGPT",
      header: "PolyGPT",
      size: 1,
      cell: ({ row }) => {
        const value = row.original.PolyGPT;
        const presentValue = isNullOrUndefined(value)
          ? ""
          : value
          ? "Yes"
          : "No";
        return (
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            {presentValue}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "AI_ASSESSMENT",
      header: "Assessments",
      size: 1,
      cell: ({ row }) => {
        const value = row.original.AI_ASSESSMENT;
        const presentValue = isNullOrUndefined(value)
          ? ""
          : value
          ? "Yes"
          : "No";
        return (
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            {presentValue}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "PolicyComparison",
      header: "Compare Policy",
      size: 1,
      cell: ({ row }) => {
        const value = row.original.PolicyComparison;
        const presentValue = isNullOrUndefined(value)
          ? ""
          : value
          ? "Yes"
          : "No";

        return (
          <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
            {presentValue}
          </CustomText>
        );
      },
    },
    ...(isEdit
      ? [
          {
            accessorKey: "is_active",
            header: "Active",
            size: 1,
            cell: ({ row }: { row: any }) => {
              const value = row.original?.is_active;
              const presentValue = isNullOrUndefined(value)
                ? ""
                : value
                ? "True"
                : "False";
              return (
                <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                  {presentValue}
                </CustomText>
              );
            },
          },
        ]
      : []),
  ];
  return (
    <div className="flex w-full flex-col p-6 border rounded-[16px] gap-5">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <CustomText stylearr={[16, 24, 400]} color={"#141414"}>
            Step 2
          </CustomText>
          <CustomText stylearr={[16, 20, 600]} color={"#141414"}>
            Review
          </CustomText>
        </div>
        <div
          className="h-[26px] flex items-center justify-center rounded-[8px]"
          style={{
            background:
              "linear-gradient(95deg, rgba(55, 98, 221, 0.12) -1.14%, rgba(29, 53, 119, 0.12) 158.31%)",
          }}
        >
          <GradientText
            text={`${data?.length} rows imported`}
            gradient={"linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"}
            className="text-xs font-semibold px-[10px]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {" "}
        <CustomTable
          columns={columns}
          data={paginatedData}
          stickyHeader={true}
          lastAlignRight={false}
        />
        {totalPages > 1 && (
          <Pagination
            page={page}
            setPage={(e) => {
              setPage(e);
            }}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalCount={data?.length}
          />
        )}
      </div>
    </div>
  );
}
