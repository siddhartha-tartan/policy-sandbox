import { Flex } from "@chakra-ui/react";
import { ArchivePolicyItem } from "../../hooks/useGetArchivePolicy";
import { Row } from "@tanstack/react-table";
import {
  POLICY_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import ViewAction from "../../../Actions/ViewAction";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../hooks/useGetUserType";
import RestoreAction from "./RestoreAction";

const Action = ({ row }: { row: Row<ArchivePolicyItem> }) => {
  const userType = useGetUserType();
  const navigate = useNavigate();
  return (
    <Flex gap={"12px"} justifyContent={"flex-end"} alignItems={"center"}>
      <ViewAction
        onClick={() => {
          navigate(
            `${POLICY_ROUTES[userType]}/${row?.original?.category_id}/detail/${row?.original?.id}`
          );
        }}
      />
      {(userType === UserType.ADMIN || userType === UserType.SPOC) && (
        <RestoreAction data={row.original} />
      )}
    </Flex>
  );
};

export default Action;
