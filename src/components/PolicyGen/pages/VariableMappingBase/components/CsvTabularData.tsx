import { FlexProps } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { truncate } from "lodash";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomTable from "../../../../common/CustomTable";
import { IAddDestinationVariable } from "../hooks/useAddDestinationVariables";

interface CsvTabularDataProps extends FlexProps {
  data: IAddDestinationVariable[];
}

const columns: ColumnDef<IAddDestinationVariable>[] = [
  {
    accessorKey: "destination_variable",
    header: "Destination Variable",
    cell: ({ row }) => {
      const value: string = row.getValue("destination_variable");
      return (
        <Flex className="flex-row gap-2 items-center">
          <Flex className="w-8 h-6 items-center justify-center bg-[#E1F5FE] text-[#0074FF] rounded-[6px]">
            {row.original?.data_type?.[0]?.toUpperCase()}
          </Flex>
          <CustomText stylearr={[12, 19, 500]}>{value}</CustomText>
        </Flex>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Key Highlights",
    cell: ({ row }) => {
      const value: string = row.getValue("description") || "-";
      return (
        <CustomText stylearr={[12, 19, 500]} title={value}>
          {truncate(value, {
            length: 38,
            omission: "...",
          })}
        </CustomText>
      );
    },
  },
];

const CsvTabularData = ({ data, ...props }: CsvTabularDataProps) => {
  return (
    <Flex {...props}>
      <CustomTable data={data} columns={columns} />
    </Flex>
  );
};

export default CsvTabularData;
