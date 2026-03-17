import { Box, TextProps } from "@chakra-ui/react";
import { ColumnDef, Table as ReactTable } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useEffect } from "react";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { UserType } from "../../../../../utils/constants/constants";
import { formatDateTimeString } from "../../../../../utils/helpers/formatDate";
import { getPolicyItemFinalStatus } from "../../../../../utils/helpers/policyStatusHelper";
import CustomCheckbox from "../../../../CustomCheckbox";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../CustomTable";
import Status from "../../../Status";
import { PolicyItem } from "../../hooks/useGetPolicyByCategory";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../atom";
import Action from "./Action";
import ActionHeader from "./ActionHeader";
import ExpiryDate from "./ExpiryDate";

interface IProps extends TextProps {
  readonly stylearr: [number, number, number];
  readonly children?: React.ReactNode;
}

const TextComponent = ({ stylearr, ...props }: IProps) => {
  return (
    <CustomText stylearr={stylearr} {...props}>
      {props.children}
    </CustomText>
  );
};

export default function Table({ data }: { data: PolicyItem[] }) {
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, setUnSelectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const userType = useGetUserType();
  useEffect(() => {
    setSelectAll(false);
    setSelectedRowIds(new Set<string>());
    setUnSelectedRowIds(new Set<string>());
  }, [window.location]);
  const columns: ColumnDef<PolicyItem>[] = [
    ...(userType === UserType.ADMIN || userType === UserType.SPOC
      ? [
          {
            id: "selection",
            size: 50,
            header: ({ table }: { table: ReactTable<PolicyItem> }) => (
              <CustomCheckbox
                isChecked={table.getIsAllRowsSelected()}
                setIsChecked={(e) => table.getToggleAllRowsSelectedHandler()(e)}
              />
            ),
          } as ColumnDef<PolicyItem>,
        ]
      : []),
    {
      accessorKey: "name",
      header: () => "Policy Name",
      size: 200,
      cell: ({ row }) => (
        <TextComponent stylearr={[12, 19, 500]} color={systemColors.grey[900]}>
          {row.getValue("name")}{" "}
        </TextComponent>
      ),
    },

    {
      accessorKey: "owner",
      header: () => "Policy Owner",
      cell: ({ row }) => (
        <TextComponent stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("owner")}
        </TextComponent>
      ),
    },

    {
      accessorKey: "creation_date",
      header: () => "Date of Creation",
      size: 180,
      cell: ({ row }) => (
        <TextComponent stylearr={[11, 19, 400]} color={systemColors.grey[900]}>
          {formatDateTimeString(new Date(row.getValue("creation_date")))}
        </TextComponent>
      ),
    },
    {
      accessorKey: "modified_date",
      header: () => "Last Modified",
      size: 180,
      cell: ({ row }) => (
        <TextComponent stylearr={[11, 19, 400]} color={systemColors.grey[900]}>
          {formatDateTimeString(new Date(row.getValue("modified_date")))}
        </TextComponent>
      ),
    },
    {
      accessorKey: "validity",
      header: () => "Review Date",
      size: 180,
      cell: ({ row }) => <ExpiryDate value={row.getValue("validity")} />,
    },
    {
      accessorKey: "status",
      header: () => "Status",
      cell: ({ row }) => {
        const policyItem = row.original;
        const finalStatus = getPolicyItemFinalStatus(policyItem);

        return <Status minW={"120px"} status={finalStatus} />;
      },
    },
    {
      accessorKey: "id",
      header: () =>
        userType === UserType.ADMIN || userType === UserType.SPOC ? (
          <ActionHeader isDisabled={!data?.length} />
        ) : (
          "Action"
        ),
      size: 1,
      cell: ({ row }) => <Action row={row} key={row.original.id} />,
      enableSorting: false,
    },
  ];

  return (
    <Box className="h-full overflow-y-auto grow">
      <CustomTable
        columns={columns}
        data={data}
        selectedRows={selectedRowIds}
        setSelectedRows={setSelectedRowIds}
        unSelectedRows={unSelectedRowIds}
        setUnSelectedRows={setUnSelectedRowIds}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        stickyHeader={true}
      />
    </Box>
  );
}
