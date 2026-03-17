import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import HeaderBackCta from "../../../../../common/HeaderBackCta";
import PageLayout from "../../../../../common/PageLayout";
import { TESTBED_SUB_ROUTES } from "../../../../contants";
import { ADVANCED_DATA_CREATION_SUB_ROUTES } from "../../constants";
import Header from "./components/Header";
import RuleDescriptionModal from "./components/RuleDescriptionModal";
import TableSection from "./components/TableSection";
import TestComingSoonModal from "../../../../../PolicyGen/pages/ThreadView/components/TestComingSoonModal";
import ChooseTestbedFlowModal from "../../../../components/ChooseTestbedFlowModal";
import { HISTORICAL_DATA_TESTING_SUB_ROUTES } from "../../../HistoricalDataTesting/constants";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function Result() {
  const { categoryId, policyId, fileId } = useParams();
  const userType = useGetUserType();
  const location = useLocation();

  const backRoute = useMemo(() => {
    if (!categoryId || !policyId || !fileId) return "";

    const baseRoute = `${BASE_ROUTES[userType]}/testbed`;
    const isAdvancedDataCreation = location.pathname?.includes(
      TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION
    );

    const subRoute = isAdvancedDataCreation
      ? ADVANCED_DATA_CREATION_SUB_ROUTES.TEST
      : HISTORICAL_DATA_TESTING_SUB_ROUTES.TEST;

    return `${baseRoute}/${
      isAdvancedDataCreation
        ? TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION
        : TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING
    }/${subRoute
      ?.replace(":categoryId", categoryId)
      .replace(":policyId", policyId)
      .replace(":fileId", fileId)}`;
  }, [categoryId, policyId, fileId, userType, location.pathname]);

  return (
    <PageLayout>
      <HeaderBackCta navigateTo={backRoute} />
      <motion.div
        className="flex flex-col gap-[24px] pt-2 flex-grow h-full overflow-y-auto"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Header />
        <div className="flex flex-col gap-[24px] overflow-y-auto p-6 flex-grow bg-white rounded-[8px]">
          <TableSection />
        </div>
      </motion.div>
      <RuleDescriptionModal />
      <TestComingSoonModal />
      <ChooseTestbedFlowModal />
    </PageLayout>
  );
}
