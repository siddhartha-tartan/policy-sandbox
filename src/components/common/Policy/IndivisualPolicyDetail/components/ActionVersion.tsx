import { Flex } from "@chakra-ui/react";
import { Row } from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import ViewAction from "../../../Actions/ViewAction";
import { VersionHistoryItem } from "../../hooks/useGetPolicyDetails";
import { UserType } from "../../../../../utils/constants/constants";
import useGetUserType from "../../../../../hooks/useGetUserType";
import DownloadAction from "./DownloadAction";

export default function ActionVersion({
  row,
}: {
  row: Row<VersionHistoryItem>;
}) {
  const navigate = useNavigate();
  const id = row?.getValue("id");
  const userType: UserType = useGetUserType();
  const { categoryId, id: policyId } = useParams();
  const appendQueryParam = (key: string, value: string) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set(key, value); // Add or update the query param
    navigate(`?${currentParams.toString()}`, { replace: false });
  };
  return (
    <Flex gap={"12px"} justifyContent={"flex-end"} alignItems={"center"}>
      <ViewAction
        cursor={"pointer"}
        //@ts-ignore
        onClick={() => appendQueryParam("versionId", id)}
      />
      {userType === UserType.ADMIN && (
        <DownloadAction
          categoryId={categoryId!}
          policyId={policyId || ""}
          fileId={row.original.id}
          fileName={row.original.name}
        />
      )}
    </Flex>
  );
}
