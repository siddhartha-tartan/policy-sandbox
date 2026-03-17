import { ChevronDownIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import AnimatedSkeleton from "../../../../../../PolicyGen/pages/ThreadView/components/AnimatedSkeleton";
import {
  policyDataAtom,
  ruleConfigsAtom,
  rulesCheckedStateAtom,
  uniqueVariablesAtom,
} from "../../../advancedDataCreationAtom";
import useGetVariables from "../../../hooks/useGetVariables";
import { getTestBedFlowType } from "../../../../../utils/helpers";
import { TESTBED_SUB_ROUTES } from "../../../../../contants";

export default function Header() {
  const [showDesc, setShowDesc] = useState(false);
  const policyData = useAtomValue(policyDataAtom);
  const rulesCheckedState = useAtomValue(rulesCheckedStateAtom);
  const isDisabled = !Object.values(rulesCheckedState).some(
    (state) => state === true
  );
  const flowType = getTestBedFlowType();
  const policyDetailsConfig = [
    { label: "Product Category", value: policyData?.loan_category },
    { label: "Policy Owner", value: policyData?.owner },
    //@ts-ignore
    { label: "Policy Version", value: policyData?.version },
    { label: "Rule Version", value: "V1" },
  ];

  const { mutate, isLoading, data } = useGetVariables();
  const [_, setRuleConfigs] = useAtom(ruleConfigsAtom);
  const setVariables = useSetAtom(uniqueVariablesAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!data) return;

    setVariables(data);
    setRuleConfigs({});
    const routes = {
      [TESTBED_SUB_ROUTES.ADVANCED_DATA_CREATION]: "variables",
      [TESTBED_SUB_ROUTES.HISTORICAL_DATA_TESTING]: "upload",
    };

    const nextRoute = routes?.[flowType];
    if (nextRoute) {
      navigate(nextRoute);
    }
  }, [data, flowType, navigate, setRuleConfigs, setVariables]);

  const renderPolicyDetails = () => (
    <div className="flex gap-[40px]">
      {policyDetailsConfig?.map((detail) => (
        <div className="flex flex-col gap-4">
          <CustomText stylearr={[12, 16, 700]} className="text-[#ABAAAD]">
            {detail.label}:
          </CustomText>
          <CustomText stylearr={[14, 19, 500]} className="text-[#424242]">
            {detail.value}
          </CustomText>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      className="flex flex-col gap-[24px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex w-full justify-between items-center">
        {policyData?.name ? (
          <div className="flex gap-3 items-center">
            <CustomText
              stylearr={[21, 27, 700]}
              className="first-letter:capitalize"
            >
              {policyData?.name}
            </CustomText>
            <ChevronDownIcon
              fontSize={"25px"}
              className="cursor-pointer transition-all"
              transform={showDesc ? "rotate(180deg)" : "rotate(0deg)"}
              onClick={() => setShowDesc(!showDesc)}
            />
          </div>
        ) : (
          <AnimatedSkeleton />
        )}
        <CustomButton
          style={{
            background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
          }}
          onClick={() => {
            mutate({
              ruleIds: Object.keys(rulesCheckedState).filter(
                (row) => rulesCheckedState[row] === true
              ),
            });
          }}
          isLoading={isLoading}
          w={"152px"}
          isDisabled={isDisabled}
        >
          Proceed
        </CustomButton>
      </div>
      {showDesc && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.5 }}
        >
          {renderPolicyDetails()}
        </motion.div>
      )}
    </motion.div>
  );
}
