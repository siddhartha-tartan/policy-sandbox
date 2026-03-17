import { Flex } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuFileText } from "react-icons/lu";
import {
  formatDate,
  formatTime,
} from "../../../../../utils/helpers/formatDate";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../CustomTable";
import Status, { StatusTypes } from "../../../Status";
import { VersionHistoryItem } from "../../hooks/useGetPolicyDetails";
import ActionVersion from "./ActionVersion";

// Helper function to map API status to StatusTypes
const mapStatusToStatusType = (status: string): StatusTypes => {
  switch (status) {
    case "Successful":
      return StatusTypes.SUCCESS;
    case "Processing":
      return StatusTypes.PENDING;
    case "Failed":
      return StatusTypes.FAILED;
    default:
      return StatusTypes.INACTIVE;
  }
};

export const columns: ColumnDef<VersionHistoryItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => {
      return (
        <Flex gap={3} alignItems={"center"}>
          <LuFileText color={systemColors.grey[500]} fontSize={"16px"} />
          <CustomText stylearr={[12, 19, 500]} color={systemColors.grey[900]}>
            {row.getValue("name")}
          </CustomText>
        </Flex>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("owner")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Modified",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {formatDate(new Date(row.getValue("updated_at")))},
          {formatTime(new Date(row.getValue("updated_at")))}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "modified_by",
    header: "Modified By",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("modified_by")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("version")} {row.index === 0 ? " Current" : ""}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Status status={mapStatusToStatusType(status)} />;
    },
  },
  {
    accessorKey: "id",
    header: "Action",
    enableSorting: false,
    size: 1,
    cell: ({ row }) => {
      return <ActionVersion row={row} />;
    },
  },
];

export default function VersionHistory({
  data,
}: {
  data: VersionHistoryItem[];
}) {
  return <CustomTable columns={columns} data={data} />;
}
