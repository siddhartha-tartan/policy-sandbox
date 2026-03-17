import { Flex, Spinner } from "@chakra-ui/react";
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CompareIcon from "../../../../assets/Icons/CompareIcon";
import useGetUserType from "../../../../hooks/useGetUserType";
import { userStore } from "../../../../store/userStore";
import {
  BASE_ROUTES,
  POLICY_ROUTES,
  UserType,
} from "../../../../utils/constants/constants";
import { getLoanCategoryTypeById } from "../../../../utils/helpers/loanCategoryHelpers";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import { PolicyGenParamsEnum } from "../../../PolicyGen/pages/ThreadView/utils/constant";
import ComparePolicyVersionsCta from "../../ComparePolicy/components/ComparePolicyVersionsCta";
import ComparisonProcessingModal from "../../ComparePolicy/components/ComparisonProcessingModal";
import FormHeader from "../../FormHeader";
import PageLayout from "../../PageLayout";
import useGetPolicyDetails from "../hooks/useGetPolicyDetails";
import { BREADCRUMBS_POLICY, POLICY_SUB_ROUTES } from "../utils/constants";
import PolicyDetails from "./components/PolicyDetails";
import TabContentWrapper from "./components/TabContentWrapper";
import VersionHistory from "./components/VersionHistory";
import PolicyInfoBox from "./components/PolicyInfoBox";

export const ACTIVE_BUTTON = {
  POLICYDETAIL: "policyDetails",
  VERSIONHISTORY: "versionHistory",
};

export default function IndivisualPolicyDetail() {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const baseNav = `${BASE_ROUTES[userType]}/policy`;
  const { categoryId, id } = useParams();
  const { editableLoanCategories } = userStore();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const versionId = query.get("versionId");
  const { data, versionData } = useGetPolicyDetails();
  const baseFileId = versionData?.[0]?.id;
  const compareFileId = versionData?.[1]?.id;
  const compareSuccessUrl = useMemo(
    () =>
      `${
        BASE_ROUTES[userType]
      }/policy/${POLICY_SUB_ROUTES.COMPARE_POLICY.replace(
        ":categoryId",
        categoryId!
      ).replace(":id", id!)}?${
        PolicyGenParamsEnum.BASE_FILE_ID
      }=${baseFileId}&${PolicyGenParamsEnum.COMPARE_FILE_ID}=${compareFileId}`,
    [categoryId, id, baseFileId, compareFileId]
  );

  const isSpoc =
    userType === UserType.SPOC &&
    editableLoanCategories?.some(
      (category) => category?.id === data?.loan_category_id
    );
  return (
    <PageLayout
      breadCrumbsData={
        data
          ? [
              {
                label: BREADCRUMBS_POLICY.POLICIES,
                navigateTo: baseNav,
              },
              {
                label: getLoanCategoryTypeById(
                  data?.loan_category_id,
                  editableLoanCategories
                ),
                navigateTo: `${baseNav}/${data?.loan_category_id}`,
              },
              {
                label: data?.name,
                navigateTo: "",
              },
            ]
          : []
      }
      h={"120dvh"}
    >
      <Flex
        borderRadius={"16px"}
        gap={"32px"}
        flexDir={"column"}
        bgColor={systemColors.white.absolute}
        p={6}
        w="full"
        flexGrow={1}
        h="full"
        overflowY={"auto"}
      >
        <FormHeader
          w={"full"}
          actionBackCTA={() => {
            navigate(-1);
          }}
          showBackCTA
          tooltip={<PolicyInfoBox data={data!} />}
          headerText={data?.name!}
          rightComponent={
            <Flex className="gap-4">
              {isSpoc && (
                <CustomButton
                  onClick={() => {
                    navigate(
                      `${POLICY_ROUTES[userType]}/${categoryId}/edit/${id}`
                    );
                  }}
                  w={"135px"}
                >
                  Modify
                </CustomButton>
              )}
              <ComparePolicyVersionsCta
                isDisabled={versionData?.length < 2}
                leftIcon={<CompareIcon />}
                useModal={true}
                versionData={versionData || []}
                onCompareSuccess={() => navigate(compareSuccessUrl)}
              />
            </Flex>
          }
        />

        <TabContentWrapper
          versionHistory={
            data ? (
              <>
                {versionId && id ? (
                  <PolicyDetails data={data} policyId={id} />
                ) : (
                  <VersionHistory data={versionData} />
                )}
              </>
            ) : (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flexGrow={1}
              >
                <Spinner />
              </Flex>
            )
          }
          policyDetails={
            data ? (
              <PolicyDetails data={data} policyId={id!} />
            ) : (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flexGrow={1}
              >
                <Spinner />
              </Flex>
            )
          }
        />
      </Flex>
      <ComparisonProcessingModal />
    </PageLayout>
  );
}
