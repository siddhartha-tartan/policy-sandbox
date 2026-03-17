import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import HeaderBackCta from "../../../../../common/HeaderBackCta";
import PageLayout from "../../../../../common/PageLayout";
import useGetPolicyDetails from "../../../../../common/Policy/hooks/useGetPolicyDetails";
import { POLICYGEN_SUB_ROUTES } from "../../../../../common/PolicyGen/utils/constants";
import { policyDataAtom } from "../../advancedDataCreationAtom";
import Header from "./components/Header";
import Rules from "./components/Rules";

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

export default function BreRule() {
  const { categoryId, policyId, fileId } = useParams();
  const { data, versionData } = useGetPolicyDetails(categoryId, policyId);
  const setPolicyData = useSetAtom(policyDataAtom);
  const userType = useGetUserType();

  const backRoute = useMemo(() => {
    if (!categoryId || !policyId || !fileId) return "";

    return `${
      BASE_ROUTES[userType]
    }/policygen/${POLICYGEN_SUB_ROUTES.POLICY_GEN_DATA?.replace(
      ":categoryId",
      categoryId
    )
      .replace(":policyId", policyId)
      .replace(":fileId", fileId)}`;
  }, [categoryId, policyId, fileId, userType]);

  useEffect(() => {
    if (!data) return;

    const policyData = {
      ...data,
      version: versionData?.find((item) => item.id === fileId)?.version,
    };
    setPolicyData(policyData);
  }, [data, versionData, fileId, setPolicyData]);

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
        <Rules />
      </motion.div>
    </PageLayout>
  );
}
