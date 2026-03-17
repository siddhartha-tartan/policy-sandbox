import { Spinner } from "@chakra-ui/react";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import PageLayout from "../../../PageLayout";
import ManageWorkFlowCta from "../../common/components/ManageWorkFlowCta";
import ApprovalsTable from "./components/ApprovalsTable";
import SearchFilter from "./components/SearchFilter";
import useGetApprovalRequests from "./hooks/useGetApprovalRequests";
import { useEffect } from "react";

const Approvals = () => {
  const {
    data,
    pageSize,
    setPageSize,
    pageNumber,
    setPageNumber,
    totalPages,
    setSearchQuery,
    priority,
    setPriority,
    requestedBy,
    setRequestedBy,
    isLoading,
    totalCount,
  } = useGetApprovalRequests("pending");

  useEffect(() => {
    setPageNumber(1);
    setSearchQuery("");
    setPriority("");
    setRequestedBy("");
  }, []);

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 h-full overflow-y-auto p-6 rounded-[16px] bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[22, 26, 700]}>Approvals</CustomText>
            <CustomText stylearr={[12, 14, 600]} color={"#555557"}>
              Manage Request Workflows
            </CustomText>
          </div>
          <ManageWorkFlowCta />
        </div>
        <SearchFilter
          setSearch={setSearchQuery}
          priority={priority}
          setPriority={setPriority}
          requestedBy={requestedBy}
          setRequestedBy={setRequestedBy}
        />
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ApprovalsTable
            data={data?.approvals || []}
            pageSize={pageSize}
            setPageSize={setPageSize}
            page={pageNumber}
            setPage={setPageNumber}
            totalPages={totalPages}
            totalCount={totalCount}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Approvals;
