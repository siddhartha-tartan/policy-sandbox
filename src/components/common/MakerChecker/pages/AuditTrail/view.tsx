import { useEffect } from "react";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import HeaderBackCta from "../../../HeaderBackCta";
import PageLayout from "../../../PageLayout";
import ManageWorkFlowCta from "../../common/components/ManageWorkFlowCta";
import { MAKER_CHECKER_SUB_ROUTES } from "../../utils/constant";
import ApprovalsTable from "../Approvals/components/ApprovalsTable";
import useGetApprovalRequests from "../Approvals/hooks/useGetApprovalRequests";
import SearchFilter from "./components/SearchFilter";

const AuditTrail = () => {
  const userType = useGetUserType();
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
  } = useGetApprovalRequests("all");

  useEffect(() => {
    setPageNumber(1);
    setSearchQuery("");
    setPriority("");
    setRequestedBy("");
  }, []);

  return (
    <PageLayout>
      <HeaderBackCta
        navigateTo={`${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.BASE}`}
      />
      <div className="flex flex-col gap-6 h-full overflow-y-auto p-6 rounded-[16px] bg-white">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[22, 26, 700]}>Audit Trail</CustomText>
            <CustomText stylearr={[12, 14, 600]} color={"#555557"}>
              Track all document changes with a clear, time-stamped log for
              transparency and accountability.
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
        <ApprovalsTable
          data={data?.approvals || []}
          pageSize={pageSize}
          setPageSize={setPageSize}
          page={pageNumber}
          setPage={setPageNumber}
          totalPages={totalPages}
          isAuditTrailTable={true}
          totalCount={data?.pagination?.total_items!}
        />
      </div>
    </PageLayout>
  );
};

export default AuditTrail;
