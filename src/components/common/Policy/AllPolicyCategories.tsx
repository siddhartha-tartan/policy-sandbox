import { Flex, Grid, Spinner, StackDivider, VStack } from "@chakra-ui/react";
import useGetUserType from "../../../hooks/useGetUserType";
import { userStore } from "../../../store/userStore";
import { UserType } from "../../../utils/constants/constants";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";
import CustomText from "../../DesignSystem/Typography/CustomText";
import AddNewPolicy from "../AddNewPolicy";
import ArchivedPolicyCta from "../ArchivedPolicyCta";
import PageLayout from "../PageLayout";
import PolicyBox from "./PolicyBox";
import { BREADCRUMBS_POLICY } from "./utils/constants";

export default function AllPolicyCategories() {
  const { loanCategories: config } = userStore();
  const userType = useGetUserType();
  return (
    <PageLayout
      breadCrumbsData={
        config ? [{ label: BREADCRUMBS_POLICY.POLICIES, navigateTo: "" }] : []
      }
    >
      <VStack
        w="full"
        flexDir={"column"}
        p="24px"
        gap={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        divider={<StackDivider borderColor={"rgba(0, 0, 0, 0.08)"} />}
      >
        <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
          <Flex gap={2} flexDir={"column"}>
            <CustomText color={systemColors.grey[900]} stylearr={[24, 31, 700]}>
              Policies
            </CustomText>
            <CustomText color={systemColors.grey[600]} stylearr={[14, 22, 500]}>
              All policies
            </CustomText>
          </Flex>
          <Flex className="flex-row gap-2">
            {(userType === UserType.ADMIN || userType === UserType.SPOC) && (
              <ArchivedPolicyCta />
            )}

            <AddNewPolicy />
          </Flex>
        </Flex>
        {!config?.length ? (
          <Spinner />
        ) : (
          <Grid w="full" gridTemplateColumns={"repeat(3,1fr)"} gap={"24px"}>
            {config?.map((row, id) => {
              return <PolicyBox data={row} key={id} />;
            })}
          </Grid>
        )}
      </VStack>
    </PageLayout>
  );
}
