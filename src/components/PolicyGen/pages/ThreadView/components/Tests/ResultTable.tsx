import { Flex } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomTable from "../../../../../common/CustomTable";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { ITestResult } from "../../hooks/useValidateRule";

export default function ResultTable({ data }: { data: ITestResult[] }) {
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);
  useEffect(() => {
    if (data) {
      const temp: number[] = [];
      data?.map((row, id) => {
        if (row?.failure_reason) temp.push(id);
      });
      setHighlightedRows(temp);
    }
  }, [data]);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "s.no",
      header: "S.No",
      size: 10,
      cell: ({ row: { index } }) => {
        return <CustomText stylearr={[12, 19, 500]}>{index + 1}</CustomText>;
      },
    },
    {
      accessorKey: "name",
      header: "Profiles",
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[12, 19, 500]}>
            {row.getValue("name")}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "actual",
      header: "Actual",
      cell: ({ row }) => {
        return (
          <CustomText className="capitalize" stylearr={[12, 19, 600]}>
            {row.getValue("actual") ? "Yes" : "No"}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "expected",
      header: "Expected",
      cell: ({ row }) => {
        return (
          <CustomText className="capitalize" stylearr={[12, 19, 600]}>
            {row.getValue("expected") ? "Yes" : "No"}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "failure_reason",
      header: "Reason(s) for Rejection",
      cell: ({ row }) => {
        if (row.getValue("failure_reason"))
          return (
            <CustomButton
              h={"32px"}
              className="text-[10px] font-bold"
              borderColor={"#176FC1"}
              color={"#176FC1"}
              variant="secondary"
              // onClick={() => {
              //   const url = `${
              //     BASE_ROUTES[userType]
              //   }/policygen/${categoryId}/${policyId}/${fileId}/${row.getValue(
              //     "failure_reason"
              //   )}?request_id=${requestId}`;
              //   window.open(url, "_blank");
              // }}
            >
              <Flex className="flex gap-1 items-center">
                <CustomText stylearr={[10, 18, 700]} className="capitalize">
                  {(row.getValue("failure_reason") as String)
                    ?.split("_")
                    ?.join(" ")}
                </CustomText>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={13}
                  height={13}
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M3.95 9.5L8.75 4.7V9H9.75V3H3.75V4H8.05L3.25 8.8L3.95 9.5Z"
                    fill="#176FC1"
                  />
                </svg> */}
              </Flex>
            </CustomButton>
          );
        return <></>;
      },
    },
  ];

  return (
    <div className="border-[#CFD6DC] border-[1px] rounded-[6px] overflow-y-auto">
      <CustomTable
        columns={columns}
        data={data}
        highlightedRows={highlightedRows}
        lastAlignRight={false}
      />
    </div>
  );
}
