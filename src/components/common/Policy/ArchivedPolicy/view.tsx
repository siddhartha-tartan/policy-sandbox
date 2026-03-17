import { Flex, Spinner } from "@chakra-ui/react";
import useGetUserType from "../../../../hooks/useGetUserType";
import { UserType } from "../../../../utils/constants/constants";
import PageLayout from "../../PageLayout";
import { BREADCRUMBS_POLICY } from "../utils/constants";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CommonSearchBar from "../../CommonSearchBar";
import Pagination from "../../Pagination";
import useGetArchivePolicy from "../hooks/useGetArchivePolicy";
import ArchiveTable from "./components/ArchiveTable";
import CommonLoanCategoryDropdown from "../../CommonLoanCategoryDropdown";
import RestoreConfirmationModal from "./components/RestoreConfirmationModal";

const ArchivedPolicy = () => {
  const { data, page, setPage, setName, productCategory, setProductCategory } =
    useGetArchivePolicy();
  const userType = useGetUserType();
  const breadCrumbsData = [
    {
      label: BREADCRUMBS_POLICY.POLICIES,
      navigateTo: `/${UserType[userType]}/policy`,
    },
    {
      label: "Archived Policies",
      navigateTo: "",
    },
  ];

  return (
    <PageLayout breadCrumbsData={data ? breadCrumbsData : []}>
      <Flex
        w="full"
        flexDir={"column"}
        p={"24px"}
        gap={"24px"}
        alignItems={"center"}
        borderRadius={"16px"}
        bgColor={systemColors.white.absolute}
      >
        <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
          <Flex flexDir={"column"} gap={2}>
            <CustomText color={systemColors.grey[900]} stylearr={[24, 31, 700]}>
              Archived Policies
            </CustomText>
            <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
              Total {data?.policy_count || 0} Policies
            </CustomText>
          </Flex>
        </Flex>
        {!data ? (
          <Flex
            flexDir={"column"}
            gap={6}
            w={"full"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Spinner />
          </Flex>
        ) : (
          <>
            {" "}
            <Flex flexDir={"column"} gap={6} w={"full"}>
              <Flex className="flex-row gap-4 w-full">
                <CommonSearchBar
                  flexGrow={1}
                  handleChange={setName}
                  placeholder={"Search Policy"}
                />
                <CommonLoanCategoryDropdown
                  value={productCategory}
                  onChange={(e) => setProductCategory(e)}
                  //@ts-ignore
                  minWidth={"250px"}
                />
              </Flex>

              <ArchiveTable data={data?.data} />
            </Flex>
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={data?.totalPages}
            />
          </>
        )}
      </Flex>
      <RestoreConfirmationModal />
    </PageLayout>
  );
};

export default ArchivedPolicy;
