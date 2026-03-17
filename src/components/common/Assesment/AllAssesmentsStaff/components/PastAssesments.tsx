import { Flex, Spinner } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
  formatDateString,
  formatTime,
} from "../../../../../utils/helpers/formatDate";
import { getStatusOptions } from "../../../../../utils/status";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CommonDropdownComponent from "../../../CommonDropdownComponent";
import CommonLoanCategoryDropdown from "../../../CommonLoanCategoryDropdown";
import CommonSearchBar from "../../../CommonSearchBar";
import CustomTable from "../../../CustomTable";
import Pagination from "../../../Pagination";
import Status, { StatusTypes } from "../../../Status";
import useGetPastAssesments, {
  IPastAssesments,
} from "../../hooks/useGetPastAssesments";
import React from "react";

export const columns: ColumnDef<IPastAssesments>[] = [
  {
    accessorKey: "name",
    header: "Test Name",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 500]} color={systemColors.grey[900]}>
          {row.getValue("name")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date & Time",
    cell: ({ row }) => {
      const value: string = row.getValue("start_date");
      return (
        <Flex flexDir={"column"}>
          {value && (
            <React.Fragment>
              {" "}
              <CustomText
                stylearr={[12, 19, 400]}
                color={systemColors.grey[900]}
              >
                {formatDateString(new Date(value))}
              </CustomText>
              <CustomText
                stylearr={[12, 19, 400]}
                color={systemColors.grey[900]}
              >
                {formatTime(new Date(value))}
              </CustomText>
            </React.Fragment>
          )}
        </Flex>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date & Time",
    cell: ({ row }) => {
      const value: string = row.getValue("end_date");
      return (
        <Flex flexDir={"column"}>
          {value && (
            <React.Fragment>
              <CustomText
                stylearr={[12, 19, 400]}
                color={systemColors.grey[900]}
              >
                {formatDateString(new Date(value))}
              </CustomText>
              <CustomText
                stylearr={[12, 19, 400]}
                color={systemColors.grey[900]}
              >
                {formatTime(new Date(value))}
              </CustomText>
            </React.Fragment>
          )}
        </Flex>
      );
    },
  },
  {
    accessorKey: "submission_date",
    header: "Submission Date",
    cell: ({ row }) => {
      const value: string = row.getValue("submission_date");
      return (
        <Flex flexDir={"column"}>
          {value ? (
            <React.Fragment>
              <CustomText
                stylearr={[12, 19, 400]}
                color={systemColors.grey[900]}
              >
                {formatDateString(new Date(value))}
              </CustomText>
              <CustomText
                stylearr={[12, 19, 400]}
                color={systemColors.grey[900]}
              >
                {formatTime(new Date(row.getValue("submission_date")))}
              </CustomText>
            </React.Fragment>
          ) : (
            <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
              -
            </CustomText>
          )}
        </Flex>
      );
    },
  },
  {
    accessorKey: "passing_score",
    header: "Passing Score",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("passing_score")}%
        </CustomText>
      );
    },
  },
  {
    accessorKey: "your_result",
    header: "Your Result",
    cell: ({ row }) => {
      const value = row.getValue("your_result");
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {`${value}%`}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Status minW={"120px"} status={row.getValue("status")} />;
    },
  },
  {
    accessorKey: "id",
    header: "Action",
    size: 100,
    cell: ({ row }) => {
      const isDisabled = row?.original?.status === StatusTypes.MISSED;
      return (
        <Action
          id={row.getValue("id")}
          attempt_id={row?.original?.attempt_id}
          isDisabled={isDisabled}
        />
      );
    },
  },
];

const Action = ({
  id,
  attempt_id,
  isDisabled,
}: {
  id: string;
  attempt_id: string;
  isDisabled: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <CustomText
      onClick={isDisabled ? () => {} : () => navigate(`${id}/${attempt_id}`)}
      stylearr={[10, 16, 700]}
      color={isDisabled ? systemColors.black[400] : systemColors.black[600]}
      className="underline underline-offset-2 cursor-pointer"
    >
      View Details
    </CustomText>
  );
};

export default function PastAssesments() {
  const {
    data,
    isLoading,
    page,
    setPage,
    loanCategoryId,
    setLoanCategoryId,
    setAssesmentName,
    status,
    setStatus,
  } = useGetPastAssesments();

  const statusOption = getStatusOptions("PastAssessmentStatus");
  const navigate = useNavigate();
  if (isLoading || !data)
    return (
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        gap={"20px"}
        flexDir={"column"}
      >
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[24, 31, 700]}>Past Assessments</CustomText>
        </Flex>
        <Flex w={"full"} justifyContent={"center"}>
          <Spinner />
        </Flex>
      </Flex>
    );

  return (
    <Flex
      p={"24px"}
      bgColor={systemColors.white.absolute}
      borderRadius={"16px"}
      gap={"20px"}
      flexDir={"column"}
    >
      <Flex gap={2} flexDir={"column"}>
        <CustomText
          onClick={() =>
            navigate(`/staff/assessment/076dcef2-f072-471b-9066-531aee452268`)
          }
          stylearr={[24, 31, 700]}
        >
          Past Assessments
        </CustomText>
        <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
          Total {data?.total} assesments
        </CustomText>
      </Flex>
      <Flex gap={4}>
        <CommonSearchBar
          flexGrow={1}
          handleChange={setAssesmentName}
          placeholder={"Search Test name"}
        />
        <CommonLoanCategoryDropdown
          value={loanCategoryId}
          onChange={setLoanCategoryId}
        />
        <CommonDropdownComponent
          title=""
          options={statusOption}
          value={status}
          onChange={setStatus}
          matchWidth={false}
        />
      </Flex>
      <CustomTable columns={columns} data={data?.data} />
      <Flex w={"full"} justifyContent={"center"}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.total_pages}
        />
      </Flex>
    </Flex>
  );
}
