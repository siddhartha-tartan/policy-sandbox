import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import DeleteAction from "../../../../../../components/common/Actions/DeleteAction";
import ViewAction from "../../../../../../components/common/Actions/ViewAction";
import { IAssesment } from "../../../../../../components/common/Assesment/hooks/useGetAllAssesment";
import CustomTable from "../../../../../../components/common/CustomTable";
import Status from "../../../../../../components/common/Status";
import { systemColors } from "../../../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import {
  formatDate,
  formatTime,
} from "../../../../../../utils/helpers/formatDate";
import CancelAssesmentModal from "../../IndivisualAssesment/modals/CancelAssesmentModal";
import { TABS } from "../../IndivisualAssesment/view";

const columns: ColumnDef<IAssesment>[] = [
  {
    accessorKey: "name",
    header: "Test Name",
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
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      return (
        <Flex flexDir={"column"}>
          <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
            {formatDate(new Date(row.getValue("start_date")))}
          </CustomText>
          <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
            {formatTime(new Date(row.getValue("start_date")))}
          </CustomText>
        </Flex>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      return (
        <Flex flexDir={"column"}>
          <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
            {formatDate(new Date(row.getValue("end_date")))}
          </CustomText>
          <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
            {formatTime(new Date(row.getValue("end_date")))}
          </CustomText>
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
          {row.getValue("passing_score")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "participants_count",
    header: "Participants Count",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("participants_count")}
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
    cell: ({ row }) => {
      return <Action row={row} />;
    },
  },
];

const Action = ({ row }: { row: Row<IAssesment> }) => {
  const id = row.original?.id;
  const navigate = useNavigate();
  const status = row?.original?.status;
  const isDisabled = status === "CANCELLED" || status === "COMPLETED";
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex gap={"10px"} justifyContent={"flex-end"}>
      <ViewAction
        onClick={() => {
          navigate(`${id}?tab=${TABS.QUESTIONS}`);
        }}
      />
      <DeleteAction
        onClick={isDisabled ? () => {} : onOpen}
        isDisabled={isDisabled}
      />
      <CancelAssesmentModal isOpen={isOpen} onClose={onClose} id={id} />
    </Flex>
  );
};

export default function SpocAssesmentTable({ data }: { data: IAssesment[] }) {
  return (
    <Box w={"full"} flexGrow={1}>
      <CustomTable columns={columns} data={data} />
    </Box>
  );
}
