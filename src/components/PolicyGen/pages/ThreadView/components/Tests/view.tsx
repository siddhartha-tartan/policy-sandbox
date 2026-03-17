import { AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";
import { testStepAtom } from "../../threadAtom";
import { MotionWrapper } from "../../view";
import SelectDocument from "./SelectDocument";
import TestResult from "./TestResult";

export default function Tests() {
  const testStep = useAtomValue(testStepAtom);

  const render = () => {
    switch (testStep) {
      case 0:
        return <SelectDocument />;
      case 1:
        return <TestResult />;
      default:
        return <></>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <MotionWrapper id={`test-${testStep}`}>{render()}</MotionWrapper>
    </AnimatePresence>
  );
}
