import { motion } from "framer-motion";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import HeaderBackCta from "../../../../../common/HeaderBackCta";
import PageLayout from "../../../../../common/PageLayout";
import { TESTBED_SUB_ROUTES } from "../../../../contants";
import { ADVANCED_DATA_CREATION_SUB_ROUTES } from "../../constants";
import AddOptionModal from "./components/AddOptionModal";
import CreateTestModal from "./components/CreateTestModal";
import Header from "./components/Header";
import RulesPlayground from "./components/RulesPlayground";

const ANIMATION_CONFIG = {
  variants: {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 },
  },
  transition: {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  },
};

const Variables = () => {
  const { categoryId, policyId, fileId } = useParams();
  const userType = useGetUserType();

  const backRoute = useMemo(() => {
    if (!categoryId || !policyId || !fileId) return "";

    const replaceParams = (route: string) => {
      return route
        .replace(":categoryId", categoryId)
        .replace(":policyId", policyId)
        .replace(":fileId", fileId);
    };

    return `${BASE_ROUTES[userType]}/testbed/${
      TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION
    }/${replaceParams(ADVANCED_DATA_CREATION_SUB_ROUTES.BASE || "")}`;
  }, [categoryId, policyId, fileId, userType]);

  return (
    <PageLayout>
      <HeaderBackCta navigateTo={backRoute} />
      <motion.div
        className="flex flex-col gap-[24px] pt-2 flex-grow h-full overflow-y-auto"
        initial="initial"
        animate="in"
        exit="out"
        variants={ANIMATION_CONFIG.variants}
        transition={ANIMATION_CONFIG.transition}
      >
        <Header />
        <RulesPlayground />
      </motion.div>
      <CreateTestModal />
      <AddOptionModal />
    </PageLayout>
  );
};

export default Variables;
