import { Flex, Spinner } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import useGetUsersByLoanCategory from "../../../../components/common/Assesment/hooks/useGetUsersByLoanCategory";
import CustomTable from "../../../../components/common/CustomTable";
import EmployeeBox from "../../../../components/common/EmployeeBox";
import CustomCheckbox from "../../../../components/CustomCheckbox";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { formatDate } from "../../../../utils/helpers/formatDate";
import {
  assesmentDataAtom,
  emailsAtom,
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../atom";
import EmailBulkBar from "./EmailBulkBar";

export const columns: ColumnDef<any>[] = [
  {
    id: "selection",
    header: ({ table }) => (
      <CustomCheckbox
        isChecked={table.getIsAllRowsSelected()}
        setIsChecked={(e) => table.getToggleAllRowsSelectedHandler()(e)}
      />
    ),
    cell: ({ row }) => (
      <CustomCheckbox
        isChecked={row.getIsSelected()}
        //@ts-ignore
        setIsChecked={(e) => row.getToggleRowSelectedHandler()(e)}
      />
    ),
    size: 1,
  },
  {
    accessorKey: "name",
    header: "Employee Name",
    //@ts-ignore
    cell: ({ row }) => {
      return <EmployeeBox name={row.getValue("name")} />;
    },
  },
  {
    accessorKey: "email",
    header: "Email ID",
    cell: ({ row }) => {
      return (
        <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
          {row.getValue("email")}
        </CustomText>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
        {row.getValue("role")}
      </CustomText>
    ),
  },
  {
    accessorKey: "date_added",
    header: "Date Added",
    cell: ({ row }) => (
      <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
        {formatDate(new Date(row.getValue("date_added")))}
      </CustomText>
    ),
  },
  {
    accessorKey: "loan_category",
    header: "Product Category",
    cell: ({ row }) => (
      <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
        {row.getValue("loan_category")}
      </CustomText>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <CustomText stylearr={[12, 19, 400]} color={systemColors.grey[900]}>
        {row.getValue("mobile")}
      </CustomText>
    ),
  },
];

export default function UserSelected() {
  const assesmentData = useAtomValue(assesmentDataAtom);
  const { data, isLoading, emailToUserMapping } = useGetUsersByLoanCategory(
    assesmentData?.loanCategory || ""
  );
  const [selectedRowIds, setSelectedRowIds] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, setUnSelectedRowIds] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, setSelectAll] = useAtom(selectAllAtom);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<any[]>(data);
  const [emails, setEmails] = useAtom(emailsAtom);

  useEffect(() => {
    if (data?.length && !users?.length) {
      setUsers(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchQuery?.trim() !== "") {
      const filteredUsers = data?.filter(
        (item) =>
          item?.email?.includes(searchQuery) ||
          item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setUsers(filteredUsers);
    } else {
      setUsers(data);
    }
  }, [searchQuery, data]);

  useEffect(() => {
    if (!selectAll) {
      setEmails([]);
    }
  }, [selectAll]);

  const handleUnselection = (unselectedSet: Set<string>) => {
    const updatedEmails = emails?.filter((item) => {
      const userId = emailToUserMapping?.[item];
      return !unselectedSet?.has(userId);
    });
    setEmails(updatedEmails);
    setUnSelectedRowIds(new Set(unselectedSet));
  };

  const handleSelection = (selectedSet: Set<string>) => {
    const updatedEmails = emails?.filter((item) => {
      const userId = emailToUserMapping?.[item];
      return selectedSet?.has(userId);
    });
    setEmails(updatedEmails);
    setSelectedRowIds(new Set(selectedSet));
  };

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flexGrow={1}
      flexDir={"column"}
      w={"full"}
      gap={"24px"}
    >
      {isLoading ? (
        <Spinner />
      ) : data?.length ? (
        <Flex w={"full"} flexDir={"column"}>
          <EmailBulkBar
            search={searchQuery}
            setSearch={setSearchQuery}
            emailToUserMapping={emailToUserMapping}
            selectedRowIds={selectedRowIds}
            setSelectedRowIds={setSelectedRowIds}
            unSelectedRowIds={unSelectedRowIds}
            setUnSelectedRowIds={setUnSelectedRowIds}
            selectAll={selectAll}
            emails={emails}
            setEmails={setEmails}
          />
          <CustomTable
            columns={columns}
            data={users}
            lastAlignRight={false}
            selectedRows={selectedRowIds}
            setSelectedRows={handleSelection}
            unSelectedRows={unSelectedRowIds}
            setUnSelectedRows={handleUnselection}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
          />
        </Flex>
      ) : null}
    </Flex>
  );
}
