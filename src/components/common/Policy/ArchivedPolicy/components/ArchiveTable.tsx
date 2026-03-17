import { ColumnDef } from "@tanstack/react-table";
import { formatDateString } from "../../../../../utils/helpers/formatDate";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../CustomTable";
import Status from "../../../Status";
import { ArchivePolicyItem } from "../../hooks/useGetArchivePolicy";
import Action from "./Action";

export default function ArchiveTable({
  data,
}: {
  readonly data: ArchivePolicyItem[];
}) {
  const columns: ColumnDef<ArchivePolicyItem>[] = [
    {
      accessorKey: "name",
      header: "Policy Name",
      size: 250,
      cell: ({ row }) => (
        <CustomText stylearr={[12, 19, 500]} color={systemColors.grey[900]}>
          {row.getValue("name")}{" "}
        </CustomText>
      ),
    },

    {
      accessorKey: "category_name",
      header: "Policy Category",
      cell: ({ row }) => (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("category_name")}
        </CustomText>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Status minW={"120px"} status={row.getValue("status")} />
      ),
    },
    {
      accessorKey: "archive_date",
      header: "Date Archived",
      size: 180,
      cell: ({ row }) => (
        <CustomText stylearr={[11, 19, 400]} color={systemColors.grey[900]}>
          {formatDateString(new Date(row.getValue("archive_date")))}
        </CustomText>
      ),
    },
    {
      accessorKey: "id",
      header: "Action",
      size: 1,
      cell: ({ row }) => <Action row={row} />,
    },
  ];

  return <CustomTable columns={columns} data={data} lastAlignRight={true} />;
}
