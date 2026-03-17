import { Flex, Spinner } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { Bell } from "react-huge-icons/outline";
import { systemColors } from "../../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import CommonDropdownComponent from "../../../../../../components/common/CommonDropdownComponent";
import CommonSearchBar from "../../../../../../components/common/CommonSearchBar";
import CustomTable from "../../../../../../components/common/CustomTable";
import Pagination from "../../../../../../components/common/Pagination";
import Status, {
  StatusTypes,
} from "../../../../../../components/common/Status";
import { formatDate } from "../../../../../../utils/helpers/formatDate";
import { getStatusOptions } from "../../../../../../utils/status";
import { IUser } from "../hooks/useGetAssesment";
import useGetAssessmentResult from "../hooks/useGetAssesmentResult";
import useSendReminder from "../hooks/useSendReminder";

const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "User Name",
    size: 200,
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 500]} color={systemColors.grey[900]}>
          {row.getValue("name")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const value: string = row.getValue("date");
      return (
        <Flex flexDir={"column"}>
          <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
            {value && value !== "-"
              ? formatDate(new Date(row.getValue("date")))
              : "-"}
          </CustomText>
        </Flex>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("score")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "attempted",
    header: "Questions Attempted",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("attempted")}
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
    size: 1,
    //@ts-ignore
    cell: ({ row }) => {
      const isDisabled = row?.original?.status !== StatusTypes.PENDING;
      const { mutate } = useSendReminder();
      return (
        <Flex w={"full"} justifyContent={"flex-end"}>
          <CustomButton
            fontSize={"10px"}
            variant="tertiary"
            h="40px"
            isDisabled={isDisabled}
            onClick={() => {
              mutate({ user_id: row?.original?.id });
            }}
            rightIcon={<Bell fontSize={"16px"} />}
          >
            Send Reminder
          </CustomButton>
        </Flex>
      );
    },
  },
];

export default function ResultsTab() {
  const {
    data,
    isLoading,
    setAssesmentName,
    page,
    setPage,
    assessmentStatus,
    setAssessmentStatus,
  } = useGetAssessmentResult();

  if (isLoading)
    return (
      <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
        <Spinner />
      </Flex>
    );

  if (data)
    return (
      <Flex
        w={"full"}
        p={"24px"}
        borderRadius={"20px"}
        justifyContent={"center"}
        gap={"24px"}
        alignItems={"center"}
        flexDir={"column"}
        bgColor={systemColors.white.absolute}
      >
        <Flex gap={4} w={"full"}>
          <CommonSearchBar
            flexGrow={1}
            handleChange={setAssesmentName}
            placeholder={"Search by User Name"}
          />
          <CommonDropdownComponent
            options={getStatusOptions("AssessmentResultStatus")}
            title={"Select Assessment Status"}
            value={assessmentStatus}
            onChange={setAssessmentStatus}
          />
        </Flex>
        <CustomTable columns={columns} data={data?.usersData} />
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.totalPages}
        />
      </Flex>
    );
}
