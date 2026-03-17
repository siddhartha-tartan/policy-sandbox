import { motion } from "framer-motion";
import PageLayout from "../../../../../common/PageLayout";
import TableSection from "./components/TableSection";
import { useLocation, useParams } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { useMemo } from "react";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import { TESTBED_SUB_ROUTES } from "../../../../contants";
import { ADVANCED_DATA_CREATION_SUB_ROUTES } from "../../constants";
import HeaderBackCta from "../../../../../common/HeaderBackCta";
import Header from "./components/Header";
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

export default function Test() {
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
      ? ADVANCED_DATA_CREATION_SUB_ROUTES.VARIABLES
      : HISTORICAL_DATA_TESTING_SUB_ROUTES.UPLOAD;

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
    </PageLayout>
  );
}
