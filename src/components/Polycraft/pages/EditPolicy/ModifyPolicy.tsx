import { Flex, Spinner } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES, UserType } from "../../../../utils/constants/constants";
import FormHeader from "../../../common/FormHeader";
import PageLayout from "../../../common/PageLayout";
import ComparisonProcessingModal from "../../../common/ComparePolicy/components/ComparisonProcessingModal";
import useGetPolicyDetails from "../../../common/Policy/hooks/useGetPolicyDetails";
import PolicyDetails from "../../../common/Policy/IndivisualPolicyDetail/components/PolicyDetails";
import TabContentWrapper from "../../../common/Policy/IndivisualPolicyDetail/components/TabContentWrapper";
import VersionHistory from "../../../common/Policy/IndivisualPolicyDetail/components/VersionHistory";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import { POLYCRAFT_SUB_ROUTES } from "../../constants";
import EditPolicy from "./view";

export default function ModifyPolicy() {
  const { data, isLoading, versionData } = useGetPolicyDetails();
  const userType: UserType = useGetUserType();
  const isSpoc = userType === UserType.SPOC;
  const navigate = useNavigate();
  const { categoryId, id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const versionId = query.get("versionId");
  return (
    <PageLayout>
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        flexDir={"column"}
        overflowY={"auto"}
        gap={"32px"}
        flexGrow={1}
        h="full"
      >
        {isLoading || !data ? (
          <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
            <Spinner />
          </Flex>
        ) : (
          <>
            <FormHeader
              w={"full"}
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
                          `${
                            BASE_ROUTES[userType]
                          }/polycraft/${POLYCRAFT_SUB_ROUTES.VIEW_POLICY.replace(
                            ":id",
                            id || ""
                          ).replace(":categoryId", categoryId || "")}`
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
                      <PolicyDetails data={data} policyId={id || ""} />
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
              policyDetails={<EditPolicy data={data} />}
            />
          </>
        )}
      </Flex>
      <ComparisonProcessingModal />
    </PageLayout>
  );
}
