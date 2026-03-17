import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { systemColors } from "../../../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import {
  policyDataAtom,
  rulesCheckedStateAtom,
} from "../../../../AdvancedDataCreation/advancedDataCreationAtom";
import { Variable } from "../../../../AdvancedDataCreation/hooks/useGetVariables";

const Header = ({ variables }: { variables: Variable[] }) => {
  const policyData = useAtomValue(policyDataAtom);
  const rulesCheckedState = useAtomValue(rulesCheckedStateAtom);
  const config = [
    { label: "Product Category", value: policyData?.loan_category },
    { label: "Policy Owner", value: policyData?.owner },
    //@ts-ignore
    { label: "Policy Version", value: policyData?.version },
    { label: "Rule Version", value: "V1" },
    {
      label: "Rule Count",
      value: Object.keys(rulesCheckedState).filter(
        (row) => rulesCheckedState[row] === true
      ).length,
    },
    { label: "Variable Count", value: variables?.length },
  ];
  return (
    <motion.div
      className="flex flex-col w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="py-2 px-6 rounded-t-[8px]"
        style={{
          background: "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
        }}
      >
        <CustomText
          stylearr={[16, 32, 700]}
          color={systemColors.white.absolute}
        >
          Individual Loan Policy
        </CustomText>
      </div>
      <div className="flex flex-row p-4 rounded-b-[8px] space-between bg-white">
        {config?.map((item) => (
          <div className="flex flex-col gap-2 grow">
            <CustomText stylearr={[12, 17, 500]} color={"#717073"}>
              {item.label}
            </CustomText>
            <CustomText stylearr={[14, 20, 700]} color={"#141414"}>
              {item.value}
            </CustomText>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Header;
