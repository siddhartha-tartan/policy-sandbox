import { Flex, Spinner } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";
import useGetUserType from "../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../utils/constants/constants";
import { POLYCRAFT_SUB_ROUTES } from "../../Polycraft/constants";
import HeaderBackCta from "../HeaderBackCta";
import PageLayout from "../PageLayout";
import useGetPolicyDetails from "../Policy/hooks/useGetPolicyDetails";
import { POLICY_SUB_ROUTES } from "../Policy/utils/constants";
import ComparisonProcessingModal from "./components/ComparisonProcessingModal";
import PolicyComparisonTab from "./components/PolicyComparisonTab";

const ComparePolicy = () => {
  const { isLoading, versionData } = useGetPolicyDetails();
  const { categoryId, id } = useParams();
  const userType = useGetUserType();
  const location = useLocation();

  const getBackRoute = () => {
    if (location.pathname.includes("polycraft")) {
      return `${
        BASE_ROUTES[userType]
      }/polycraft/${POLYCRAFT_SUB_ROUTES.VIEW_POLICY.replace(
        ":categoryId",
        categoryId || ""
      ).replace(":id", id || "")}`;
    } else {
      return `${
        BASE_ROUTES[userType]
      }/policy/${POLICY_SUB_ROUTES.POLICY_DETAIL.replace(
        ":categoryId",
        categoryId || ""
      ).replace(":id", id || "")}`;
    }
  };

  return (
    <PageLayout>
      <HeaderBackCta navigateTo={getBackRoute()} />
      {isLoading ? (
        <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <PolicyComparisonTab data={versionData} />
      )}
      <ComparisonProcessingModal />
    </PageLayout>
  );
};

export default ComparePolicy;
