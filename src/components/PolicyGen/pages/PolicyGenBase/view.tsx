import { Flex, Icon, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { SpeedTest } from "react-huge-icons/outline";
import { useNavigate } from "react-router-dom";
import VariableIcon from "../../../../assets/Icons/VariableIcon";
import EventBus from "../../../../EventBus";
import useGetUserType from "../../../../hooks/useGetUserType";
import { userStore } from "../../../../store/userStore";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import CommonSearchBar from "../../../common/CommonSearchBar";
import PageLayout from "../../../common/PageLayout";
import { POLICYGEN_SUB_ROUTES } from "../../../common/PolicyGen/utils/constants";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import useGetPolicies from "../../../Polycraft/hooks/useGetPolicies";
import ChooseTestbedFlowModal from "../../../Testbed/components/ChooseTestbedFlowModal";
import TestComingSoonModal, {
  EVENT_OPEN_TEST_COMING_SOON_MODAL,
} from "../ThreadView/components/TestComingSoonModal";
import { VARIABLE_MAPPING_TABS } from "../VariableMappingBase/utils/constant";
import { selectedVersionAtom } from "./atom";
import PolicyTable from "./components/PolicyTable";

export default function PolicyGenBase() {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const { loanCategories } = userStore();
  const {
    data: policyData,
    setPage,
    setPageSize,
    page,
    pageSize,
    setSearch,
  } = useGetPolicies();
  const setSelectedVersion = useSetAtom(selectedVersionAtom);

  useEffect(() => {
    const versions = (policyData?.data?.data || []).reduce(
      (acc: Record<string, string>, item) => {
        if (item?.id && item?.policy_files?.[0]?.id) {
          acc[item.id] = item.policy_files[0].id;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    setSelectedVersion(versions);
  }, [policyData]);

  const ctaConfig = [
    {
      title: "Manage Variables",
      onClick: () =>
        navigate(
          `${BASE_ROUTES[userType]}/policygen/${POLICYGEN_SUB_ROUTES.VARIABLE_MAPPING}?tab=${VARIABLE_MAPPING_TABS.MAPPED}`
        ),
      icon: VariableIcon,
    },
    {
      title: "Test Center",
      onClick: () => {
        EventBus.getInstance().fireEvent(
          EVENT_OPEN_TEST_COMING_SOON_MODAL,
          "code"
        );
      },
      icon: SpeedTest,
    },
  ];

  return (
    <PageLayout>
      <div className="flex flex-col p-6 pb-2 gap-6 bg-white border border-[#FFF] rounded-[16px] w-full h-full h-full overflow-y-auto">
        <Flex
          className="flex-row justify-between rounded-[16px]"
          bg={systemColors.white.absolute}
        >
          <Flex className="flex-col gap-2">
            <CustomText stylearr={[22, 26, 700]}>Rulesense AI</CustomText>
            <CustomText stylearr={[12, 15, 600]} color={"#555557"}>
              View the recently generated Business Rules
            </CustomText>
          </Flex>
          <Flex className="flex-row gap-6">
            {ctaConfig?.map((row, id) => (
              <motion.div
                key={`l1-${id}`}
                className="border-[1px] border-[#1870C2] rounded-[8px] flex justify-center px-8 flex-row gap-2 h-[45px] cursor-pointer items-center"
                style={{
                  background: `linear-gradient(95.11deg, rgba(55, 98, 221, 0) -1.14%, rgba(29, 53, 119, 0.15) 158.31%)`,
                }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={row.onClick}
                transition={{ duration: 0.5 }}
              >
                <Icon as={row.icon} w={"20px"} h={"20px"} fontSize={"14px"} />
                <CustomText stylearr={[14, 21, 700]}>{row?.title}</CustomText>
              </motion.div>
            ))}
          </Flex>
        </Flex>
        <CommonSearchBar
          flexGrow={1}
          maxH={"40px"}
          h={"40px"}
          minW={"100%"}
          handleChange={setSearch}
          placeholder={"Search Policy, Spoc , Product and Categories"}
        />
        {loanCategories && policyData?.data ? (
          <div className="flex flex-col h-full gap-4 overflow-y-auto">
            <PolicyTable
              data={policyData?.data}
              setPageSize={setPageSize}
              pageSize={pageSize}
              page={page}
              setPage={setPage}
            />
          </div>
        ) : (
          <Flex className="w-full h-full justify-center items-center">
            <Spinner />
          </Flex>
        )}

        <TestComingSoonModal />
        <ChooseTestbedFlowModal />
      </div>
    </PageLayout>
  );
}
