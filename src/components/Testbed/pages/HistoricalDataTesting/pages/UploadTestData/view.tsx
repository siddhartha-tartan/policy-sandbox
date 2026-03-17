import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import HeaderBackCta from "../../../../../common/HeaderBackCta";
import PageLayout from "../../../../../common/PageLayout";
import { TESTBED_SUB_ROUTES } from "../../../../contants";
import { HISTORICAL_DATA_TESTING_SUB_ROUTES } from "../../constants";
import Header from "./components/Header";
import UploadCsvStepper from "./components/UploadCsvStepper";
import { useAtomValue, useSetAtom } from "jotai";
import { uniqueVariablesAtom } from "../../../AdvancedDataCreation/advancedDataCreationAtom";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { stepperAtom } from "./atom";

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

export default function UploadTestData() {
  const { categoryId, policyId, fileId } = useParams();
  const userType = useGetUserType();
  const variables = useAtomValue(uniqueVariablesAtom);
  const setStep = useSetAtom(stepperAtom);

  useEffect(() => {
    setStep(1);
  }, []);

  const backRoute = useMemo(() => {
    if (!categoryId || !policyId || !fileId) return "";

    return `${BASE_ROUTES[userType]}/testbed/${
      TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING
    }/${HISTORICAL_DATA_TESTING_SUB_ROUTES.BASE?.replace(
      ":categoryId",
      categoryId!
    )
      .replace(":policyId", policyId)
      .replace(":fileId", fileId)}`;
  }, [categoryId, policyId, fileId, userType]);

  return (
    <PageLayout>
      <HeaderBackCta navigateTo={backRoute} />
      {variables?.length ? (
        <motion.div
          className="flex flex-col gap-[24px] pt-2 flex-grow h-full overflow-y-auto"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Header variables={variables} />
          <UploadCsvStepper variables={variables} />
        </motion.div>
      ) : (
        <div className="w-full py-4 text-center">
          <CustomText stylearr={[14, 18, 500]}>No variables found</CustomText>
        </div>
      )}
    </PageLayout>
  );
}
