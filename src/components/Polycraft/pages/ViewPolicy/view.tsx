import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CompareIcon from "../../../../assets/Icons/CompareIcon";
import useGetUserType from "../../../../hooks/useGetUserType";
import { userStore } from "../../../../store/userStore";
import { BASE_ROUTES, UserType } from "../../../../utils/constants/constants";
import ComparePolicyVersionsCta from "../../../common/ComparePolicy/components/ComparePolicyVersionsCta.tsx";
import ComparisonProcessingModal from "../../../common/ComparePolicy/components/ComparisonProcessingModal.tsx";
import FormHeader from "../../../common/FormHeader";
import HeaderBackCta from "../../../common/HeaderBackCta";
import { ApproverStatusStepper } from "../../../common/MakerChecker/common/components/ApproverStatusStepper.tsx";
import useGetApprovalTimeline, {
  IApprovalUser,
} from "../../../common/MakerChecker/pages/ApprovalTimeline/hooks/useGetApprovalTimeline.ts";
import { adaptTimelineResp } from "../../../common/MakerChecker/pages/ApprovalTimeline/utils/helpers.ts";
import PageLayout from "../../../common/PageLayout";
import useGetPolicyDetails from "../../../common/Policy/hooks/useGetPolicyDetails";
import PolicyDetails from "../../../common/Policy/IndivisualPolicyDetail/components/PolicyDetails";
import PolicyInfoBox from "../../../common/Policy/IndivisualPolicyDetail/components/PolicyInfoBox.tsx";
import TabContentWrapper from "../../../common/Policy/IndivisualPolicyDetail/components/TabContentWrapper";
import VersionHistory from "../../../common/Policy/IndivisualPolicyDetail/components/VersionHistory";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import { PolicyGenParamsEnum } from "../../../PolicyGen/pages/ThreadView/utils/constant";
import { POLYCRAFT_SUB_ROUTES } from "../../constants";
import ActionSummaryTable from "./ActionSummaryTable.tsx";

export interface ApprovalStep {
  users: IApprovalUser[];
  timestamp: string;
  status: "APPROVED" | "REJECTED" | "PENDING" | "IN_PROGRESS";
  level: number;
}

const LoadingSpinner = () => (
  <Flex justifyContent="center" alignItems="center" flexGrow={1}>
    <Spinner />
  </Flex>
);

const PolicyContent = ({
  data,
  policyId,
  isReviewPending,
}: {
  data: any;
  policyId: string;
  isReviewPending?: boolean;
}) => (
  <PolicyDetails
    data={data}
    policyId={policyId}
    isReviewPending={isReviewPending}
  />
);

const VersionContent = ({
  data,
  versionData,
  versionId,
  id,
}: {
  data: any;
  versionData: any[];
  versionId: string | null;
  id: string;
}) => {
  if (!data) return <LoadingSpinner />;
  return versionId ? (
    <PolicyContent data={data} policyId={id} />
  ) : (
    <VersionHistory data={versionData} />
  );
};

export default function ViewPolicy() {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const [isReviewPending, setIsReviewPending] = useState(false);
  const {
    data,
    versionData,
    isLoading: isLoadingPolicyDetails,
  } = useGetPolicyDetails();
  const { data: timelineData } = useGetApprovalTimeline(data?.request_id);
  const { editableLoanCategories } = userStore();
  const isSpoc =
    userType === UserType.SPOC &&
    editableLoanCategories?.some(
      (category) => category?.id === data?.loan_category_id
    );
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const versionId = query.get("versionId");
  const { categoryId, id } = useParams();

  const baseFileId = versionData?.[0]?.id;
  const compareFileId = versionData?.[1]?.id;

  const handleModify = () => {
    const modifyUrl = `${
      BASE_ROUTES[userType]
    }/polycraft/${POLYCRAFT_SUB_ROUTES.EDIT_POLICY.replace(
      ":categoryId",
      categoryId || ""
    ).replace(":id", id || "")}`;
    navigate(modifyUrl);
  };
  useEffect(() => {
    if (data?.loan_category_id) {
      setIsReviewPending(data?.policy_status == "In-Review");
    }
  }, [data, isLoadingPolicyDetails]);

  return (
    <PageLayout h="150dvh">
      <HeaderBackCta
        navigateTo={`${BASE_ROUTES[userType]}/polycraft/${POLYCRAFT_SUB_ROUTES.POLICIES}`}
      />
      <Flex
        borderRadius="16px"
        gap="32px"
        flexDir="column"
        bgColor={systemColors.white.absolute}
        p={6}
        w="full"
        flexGrow={1}
        h="full"
        overflowY="auto"
      >
        <FormHeader
          w="full"
          headerText={data?.name!}
          tooltip={<PolicyInfoBox data={data!} />}
          rightComponent={
            <Flex className="gap-4">
              <ComparePolicyVersionsCta
                isDisabled={versionData?.length < 2}
                leftIcon={<CompareIcon />}
                useModal={true}
                versionData={versionData || []}
                onCompareSuccess={() =>
                  navigate(
                    `${
                      BASE_ROUTES[userType]
                    }/polycraft/${POLYCRAFT_SUB_ROUTES.COMPARE_POLICY.replace(
                      ":categoryId",
                      categoryId || ""
                    ).replace(":id", id || "")}?${
                      PolicyGenParamsEnum.BASE_FILE_ID
                    }=${baseFileId}&${
                      PolicyGenParamsEnum.COMPARE_FILE_ID
                    }=${compareFileId}`
                  )
                }
              />
              {isSpoc && (
                <CustomButton onClick={handleModify} w="135px">
                  Modify
                </CustomButton>
              )}
            </Flex>
          }
        />

        {isReviewPending && !isLoadingPolicyDetails && timelineData && (
          <div className="flex flex-col gap-8">
            <ActionSummaryTable data={timelineData} />
            <ApproverStatusStepper
              title={"Timeline of Approval"}
              data={adaptTimelineResp(timelineData)}
            />
          </div>
        )}
        <TabContentWrapper
          versionHistory={
            <VersionContent
              data={data}
              versionData={versionData}
              versionId={versionId}
              id={id || ""}
            />
          }
          policyDetails={
            data ? (
              <PolicyContent
                data={data}
                policyId={id || ""}
                isReviewPending={isReviewPending}
              />
            ) : (
              <LoadingSpinner />
            )
          }
        />
      </Flex>
      <ComparisonProcessingModal />
    </PageLayout>
  );
}
