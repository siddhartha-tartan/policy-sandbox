import { Flex, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useGetPolicyManagerByCategory from "../../../../hooks/useGetPolicyManagersByCategory";
import useGetUserType from "../../../../hooks/useGetUserType";
import { userStore } from "../../../../store/userStore";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import { getLoanCategoryTypeById } from "../../../../utils/helpers/loanCategoryHelpers";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import AddNewPolicy from "../../AddNewPolicy";
import CommonSearchBar from "../../CommonSearchBar";
import PageLayout from "../../PageLayout";
import Pagination from "../../Pagination";
import useGetArchivePolicy from "../hooks/useGetArchivePolicy";
import useGetPolicyByCategory from "../hooks/useGetPolicyByCategory";
import { BREADCRUMBS_POLICY } from "../utils/constants";
import ArchiveConfirmationModal from "./components/ArchiveConfirmationModal";
import PolicyFilters from "./components/PolicyFilters";
import Table from "./components/Table";

export default function PolicyDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: spocUsers } = useGetPolicyManagerByCategory(id!);
  useGetArchivePolicy();
  const {
    data,
    page,
    setPage,
    setName,
    policyManagers,
    setPolicyManagers,
    policyStatus,
    setPolicyStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useGetPolicyByCategory(id || "");
  const userType = useGetUserType();
  const { loanCategories } = userStore();
  const loan = getLoanCategoryTypeById(id || "", loanCategories);
  const breadCrumbsData = [
    {
      label: BREADCRUMBS_POLICY.POLICIES,
      navigateTo: `${BASE_ROUTES[userType]}/policy`,
    },
    {
      label: loan,
      navigateTo: "",
    },
  ];
  if (!data) {
    return (
      <PageLayout breadCrumbsData={data ? breadCrumbsData : []}>
        <Flex
          w="full"
          flexDir={"column"}
          p={"24px"}
          gap={"24px"}
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"16px"}
          bgColor={systemColors.white.absolute}
        >
          <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
            <Flex flexDir={"column"} gap={2}>
              <CustomText
                color={systemColors.grey[900]}
                stylearr={[24, 31, 700]}
              >
                {loan} Policies
              </CustomText>
            </Flex>
          </Flex>
          <Flex
            flexDir={"column"}
            gap={6}
            w={"full"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Spinner />
          </Flex>
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout breadCrumbsData={data ? breadCrumbsData : []}>
      <Flex className="flex flex-col w-full p-6 pb-2 gap-3 items-center rounded-[16px] bg-white h-full overflow-y-auto">
        <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
          <Flex flexDir={"column"} gap={2}>
            <CustomText color={systemColors.grey[900]} stylearr={[24, 31, 700]}>
              {loan} Policies
            </CustomText>
            <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
              Total {data?.policy_count || 0} Policies
            </CustomText>
          </Flex>
          <AddNewPolicy />
        </Flex>
        <Flex className="flex flex-col gap-6 w-full h-full overflow-y-auto">
          <Flex className="flex-row gap-4">
            {" "}
            <PolicyFilters
              owner={policyManagers}
              setOwner={setPolicyManagers}
              status={policyStatus}
              setStatus={setPolicyStatus}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              spocUsers={spocUsers}
            />
            <CommonSearchBar
              flexGrow={1}
              handleChange={setName}
              placeholder={"Search Policy"}
            />
          </Flex>

          <Table data={data?.data} />
        </Flex>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.totalPages}
        />
      </Flex>
      <ArchiveConfirmationModal categoryId={id!} />
    </PageLayout>
  );
}
