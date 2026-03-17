import { TextProps } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import FailedIcon from "../../../../../../../assets/Icons/FailedIcon";
import PassedIcon from "../../../../../../../assets/Icons/PassedIcon";
import ResultIcon from "../../../../../../../assets/Icons/ResultIcon";
import EventBus from "../../../../../../../EventBus";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { EVENT_OPEN_TEST_COMING_SOON_MODAL } from "../../../../../../PolicyGen/pages/ThreadView/components/TestComingSoonModal";
import { EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL } from "../../../../../components/ChooseTestbedFlowModal";
import { runSimulationDataAtom } from "../../../advancedDataCreationAtom";
import { RunSimulation } from "../../../hooks/useRunSimulation";

interface TestResult {
  title: string;
  value: number | string;
  icon: React.ComponentType;
  textProps?: TextProps;
}

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  passPercentage: number;
}

const calculateTestStats = (runSimulation: RunSimulation[]): TestStats => {
  const total = runSimulation.length;
  const passed = runSimulation.filter(
    (test) => test.actual_result === "pass"
  ).length;
  const failed = runSimulation.filter(
    (test) => test.actual_result === "fail"
  ).length;
  const passPercentage =
    total > 0
      ? (runSimulation?.filter?.((item) => item?.match_status === "match")
          ?.length /
          total) *
        100
      : 0;

  return {
    total,
    passed,
    failed,
    passPercentage,
  };
};

const getTestResultConfig = (stats: TestStats): TestResult[] => {
  return [
    {
      title: "Matching Percentage",
      value: `${stats.passPercentage.toFixed(1)}%`,
      icon: ResultIcon,
      textProps: {
        color: "#3762DD",
      },
    },
    {
      title: "Approved Cases",
      value: stats.passed,
      icon: PassedIcon,
      textProps: {
        color: "#388E3C",
      },
    },
    {
      title: "Rejected Cases",
      value: stats.failed,
      icon: FailedIcon,
      textProps: {
        color: "#E64A19",
      },
    },
  ];
};

interface ActionButtonProps {
  text: string;
  isPrimary?: boolean;
  onClick: () => void;
}

const ActionButton = ({
  text,
  isPrimary = false,
  onClick,
}: ActionButtonProps) => {
  const baseStyles =
    "border-[1px] border-[#1870C2] rounded-[8px] flex justify-center px-8 flex-row gap-2 h-[45px] cursor-pointer items-center";
  const widthStyles = isPrimary ? "w-[152px]" : "w-[124px]";
  const backgroundStyles = isPrimary
    ? "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
    : "linear-gradient(95.11deg, rgba(55, 98, 221, 0) -1.14%, rgba(29, 53, 119, 0.15) 158.31%)";
  const textColor = isPrimary ? "text-[#FFF]" : "text-[#555557]";

  return (
    <motion.div
      className={`${baseStyles} ${widthStyles}`}
      style={{ background: backgroundStyles }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <CustomText stylearr={[14, 21, 700]} className={textColor}>
        {text}
      </CustomText>
    </motion.div>
  );
};

const TestResultCard = ({ config }: { config: TestResult[] }) => (
  <div className="flex flex-row gap-6 p-4 rounded-[8px] bg-[#FFF] border border-[#E5E6E6] w-fit">
    {config?.map((item, index) => (
      <div key={item.title}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            <Icon as={item.icon} />
            <CustomText stylearr={[12, 16, 500]}>{item.title}</CustomText>
          </div>
          <CustomText stylearr={[14, 16, 500]} {...item.textProps}>
            {item.value}
          </CustomText>
        </div>
        {index < config.length - 1 && (
          <div className="w-[1px] bg-[#E5E6E6] self-stretch ml-6"></div>
        )}
      </div>
    ))}
  </div>
);

const Header = () => {
  const runSimulation = useAtomValue(runSimulationDataAtom);
  const stats = calculateTestStats(runSimulation);
  const config = getTestResultConfig(stats);

  return (
    <motion.div
      className="flex flex-col gap-[24px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col gap-2">
          <CustomText
            stylearr={[20, 26, 700]}
            className="first-letter:capitalize"
          >
            Test Results
          </CustomText>
          <CustomText
            stylearr={[14, 18, 500]}
            className="first-letter:capitalize"
          >
            View test results for all personas
          </CustomText>
        </div>
        <div className="flex flex-row gap-6">
          <ActionButton
            text="Test Center"
            isPrimary
            onClick={() => {
              EventBus.getInstance().fireEvent(
                EVENT_OPEN_TEST_COMING_SOON_MODAL,
                "code"
              );
            }}
          />
          <ActionButton
            text="Retest"
            onClick={() => {
              setTimeout(() => {
                EventBus.getInstance().fireEvent(
                  EVENT_OPEN_TESTBED_FLOW_SELECTION_MODAL
                );
              }, 300);
            }}
          />
        </div>
      </div>
      <TestResultCard config={config} />
    </motion.div>
  );
};

export default Header;
