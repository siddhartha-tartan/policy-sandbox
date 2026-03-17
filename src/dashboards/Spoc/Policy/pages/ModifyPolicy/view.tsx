import { Flex, Spinner } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormHeader from "../../../../../components/common/FormHeader";
import PageLayout from "../../../../../components/common/PageLayout";
import useGetPolicyDetails from "../../../../../components/common/Policy/hooks/useGetPolicyDetails";
import PolicyDetails from "../../../../../components/common/Policy/IndivisualPolicyDetail/components/PolicyDetails";
import TabContentWrapper from "../../../../../components/common/Policy/IndivisualPolicyDetail/components/TabContentWrapper";
import VersionHistory from "../../../../../components/common/Policy/IndivisualPolicyDetail/components/VersionHistory";
import { BREADCRUMBS_POLICY } from "../../../../../components/common/Policy/utils/constants";
import { systemColors } from "../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../components/DesignSystem/CustomButton";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { userStore } from "../../../../../store/userStore";
import {
  POLICY_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import { getLoanCategoryTypeById } from "../../../../../utils/helpers/loanCategoryHelpers";
import EditPolicyMode from "./components/EditPolicyMode";

export default function ModifyPolicy() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, versionData } = useGetPolicyDetails();
  const userType: UserType = useGetUserType();
  const navigate = useNavigate();
  const baseNav = `${POLICY_ROUTES[userType]}`;
  const { loanCategories } = userStore();
  const { id, categoryId } = useParams();
  const query = new URLSearchParams(location.search);
  const versionId = query.get("versionId");
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const isSpoc = userType === UserType.SPOC;
  return (
    <PageLayout
      h="200dvh"
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
                  loanCategories
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
    >
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        flexDir={"column"}
        overflowY={"auto"}
        gap={"32px"}
        flexGrow={1}
        h="full"
        ref={scrollRef}
      >
        {isLoading || !data ? (
          <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
            <Spinner />
          </Flex>
        ) : (
          <>
            <FormHeader
              w={"full"}
              actionBackCTA={() => {
                navigate(`${POLICY_ROUTES[userType]}/${categoryId}`);
              }}
              showBackCTA
              headerText={data?.name}
              rightComponent={
                <Flex className="gap-4">
                  {isSpoc && (
                    <CustomButton
                      style={{
                        background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
                      }}
                      onClick={() => {
                        navigate(
                          `${POLICY_ROUTES[userType]}/${categoryId}/detail/${id}`
                        );
                      }}
                      w={"135px"}
                    >
                      View Policy
                    </CustomButton>
                  )}
                </Flex>
              }
            />
            <TabContentWrapper
              versionHistory={
                data ? (
                  <>
                    {versionId ? (
                      <PolicyDetails data={data} policyId={id!} />
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
                <EditPolicyMode data={data} scrollToTop={scrollToTop} />
              }
              key={versionData?.length + "versions"}
            />
          </>
        )}
      </Flex>
    </PageLayout>
  );
}
