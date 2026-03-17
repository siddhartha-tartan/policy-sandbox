import { Flex, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Tick } from "react-huge-icons/solid";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { stepAtom } from "../threadAtom";

// Animation variants defined outside component to reduce nesting
const circleVariants = {
  inactive: { scale: 1, backgroundColor: "#fff", borderColor: "#ABB7C2" },
  active: { scale: 1.05, backgroundColor: "#fff", borderColor: "#0074FF" },
  completed: {
    scale: 1.2,
    backgroundColor: "#0074FF",
    borderColor: "#0074FF",
  },
};

const textVariants = {
  inactive: { color: "#ABB7C2" },
  active: { color: "#0074FF" },
  completed: { color: "#0D0B26" },
};

// Colors extracted as constants
const COLORS = {
  gray: "#ABB7C2",
  active: "#0074FF",
  black: "#0D0B26",
  border: "#B0BEC5",
  text: "#263238",
};

interface StepItemProps {
  id: number;
  title: string;
  currentStep: number;
  onStepClick: (id: number) => void;
}

// Step item extracted as a separate component
function StepItem({ id, title, currentStep, onStepClick }: StepItemProps) {
  // Determine the current state
  const isCompleted = currentStep > id;
  const isActive = currentStep === id;
  const animationState = isCompleted
    ? "completed"
    : isActive
    ? "active"
    : "inactive";

  // Determine text color
  const textColor = isCompleted
    ? COLORS.black
    : isActive
    ? COLORS.active
    : COLORS.text;

  return (
    <Flex
      className="flex-1 gap-[10px] flex-col items-center"
      key={id}
      onClick={() => onStepClick(id)}
    >
      <motion.div
        className="w-[32px] h-[32px] rounded-full flex justify-center items-center border-[#B0BEC5] border-[1px]"
        initial="inactive"
        animate={animationState}
        variants={circleVariants}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Tick color="#fff" fontSize={"20px"} />
          </motion.div>
        ) : (
          <motion.div
            variants={textVariants}
            initial="inactive"
            animate={animationState}
            transition={{ duration: 0.3 }}
          >
            <CustomText
              color={isActive ? COLORS.active : COLORS.text}
              stylearr={[13, 13, isActive ? 700 : 500]}
            >
              0{id + 1}
            </CustomText>
          </motion.div>
        )}
      </motion.div>
      <motion.div
        variants={textVariants}
        initial="inactive"
        animate={animationState}
        transition={{ duration: 0.3 }}
      >
        <CustomText color={textColor} stylearr={[13, 20, isActive ? 700 : 500]}>
          {title}
        </CustomText>
      </motion.div>
    </Flex>
  );
}

export default function Stepper() {
  const [step, setStep] = useAtom(stepAtom);
  const config = ["Rules", "Code", "Review"];

  // useEffect(() => {
  //   appendQueryParam("step", step?.toString());
  // }, [step]);

  // useEffect(() => {
  //   if (paramStep) {
  //     setStep(parseInt(paramStep));
  //   }
  // }, []);

  // Handle step click with validation logic
  const handleStepClick = (id: number) => {
    // Currently only allow clicking on first step
    if (id === 0) setStep(0);
  };

  return (
    <HStack
      divider={
        <Flex className="w-full h-[2px] bg-[#0162DD] relative top-[-12px]" />
      }
      className="w-full rounded-[6px] gap-0"
    >
      {config.map((title, id) => (
        <StepItem
          key={id}
          id={id}
          title={title}
          currentStep={step}
          onStepClick={handleStepClick}
        />
      ))}
    </HStack>
  );
}
