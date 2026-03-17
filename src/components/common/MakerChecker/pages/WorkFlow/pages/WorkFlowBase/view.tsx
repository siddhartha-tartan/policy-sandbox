import { PlusThin } from "react-huge-icons/outline";
import useGetWorkFlows from "../../hooks/useGetWorkFlows";
import PageLayout from "../../../../../PageLayout";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import SearchFilter from "./components/SearchFilter";
import WorkFlowTable from "./components/WorkFlowTable";
import { Spinner } from "@chakra-ui/react";
import { WORKFLOW_SUB_ROUTES } from "../../constant";
import { useNavigate } from "react-router-dom";
import HeaderBackCta from "../../../../../HeaderBackCta";
import { BASE_ROUTES } from "../../../../../../../utils/constants/constants";
import useGetUserType from "../../../../../../../hooks/useGetUserType";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../../utils/constant";

const WorkFlowBase = () => {
  const {
    data,
    totalPages,
    setSearchQuery,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    status,
    setStatus,
    category,
    setCategory,
    setFromDate,
    setToDate,
    isLoading,
    totalCount,
  } = useGetWorkFlows();
  const navigate = useNavigate();
  const userType = useGetUserType();

  return (
    <PageLayout>
      <HeaderBackCta
        navigateTo={`${BASE_ROUTES[userType]}/maker-checker${MAKER_CHECKER_SUB_ROUTES.BASE}`}
      />
      <div className="flex flex-col gap-6 p-6 rounded-[16px] bg-white w-full h-full">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[22, 26, 700]}>Workflows</CustomText>
            <CustomText stylearr={[12, 14, 600]} color={"#555557"}>
              Control and Automate Your Approval Process
            </CustomText>
          </div>
          <CustomButton
            variant="quaternary"
            className="py-[21px] px-6 text-base font-bold h-[52px] tracking-[0.3px]"
            leftIcon={<PlusThin fontSize={"20px"} />}
            onClick={() =>
              navigate(
                `${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.WORKFLOW}/${WORKFLOW_SUB_ROUTES.ADD}`
              )
            }
          >
            Add New Workflow
          </CustomButton>
        </div>
        <SearchFilter
          setSearch={setSearchQuery}
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <WorkFlowTable
            data={data}
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

export default WorkFlowBase;
