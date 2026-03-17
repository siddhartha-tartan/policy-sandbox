import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import EventBus from "../../../../../../../EventBus";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import AnimatedSkeleton from "../../../../../../PolicyGen/pages/ThreadView/components/AnimatedSkeleton";
import {
  policyDataAtom,
  ruleConfigsAtom,
} from "../../../advancedDataCreationAtom";
import { EVENT_OPEN_CREATE_TEST_MODAL } from "./CreateTestModal";
import { uniqueVariablesAtom } from "../../../advancedDataCreationAtom";

export default function Header() {
  const policyData = useAtomValue(policyDataAtom);
  const variables = useAtomValue(uniqueVariablesAtom);
  const ruleConfigs = useAtomValue(ruleConfigsAtom);

  const handleCreateTestClick = () => {
    // Check if there are any invalid variables (enum/string with no options selected)
    const invalidVariables = variables?.filter(
      (variable) =>
        (variable?.type === "enum" || variable?.type === "string") &&
        (!ruleConfigs[variable?.name]?.values ||
          !ruleConfigs[variable?.name]?.values?.length)
    );

    if (invalidVariables.length > 0) {
      // Find the first invalid variable element and scroll to it
      const firstInvalidId = invalidVariables?.[0]?.id;
      const invalidElement = document.getElementById(
        `variable-${firstInvalidId}`
      );

      if (invalidElement) {
        invalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      // If no invalid variables, open the create test modal
      EventBus.getInstance().fireEvent(EVENT_OPEN_CREATE_TEST_MODAL);
    }
  };

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
          </div>
        ) : (
          <AnimatedSkeleton />
        )}
        <CustomButton
          onClick={handleCreateTestClick}
          style={{
            background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
          }}
          w={"172px"}
        >
          Create Test Data
        </CustomButton>
      </div>
    </motion.div>
  );
}
