import { Image } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { useState } from "react";
import CsvImage from "../../../../../../../assets/Images/ph_file-csv-light.png";
import CustomButton from "../../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { stepperAtom } from "../atom";
import ProcessingSteps from "./ProcessingSteps";

const config = [
  "Detecting Rules from Policies",
  "Extracting variables from Rules",
  "Finding all possible variables values",
  "Permutating possible variable values",
  "Structuring test data",
];

const GenerateSampleCsv = () => {
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [step, setStep] = useAtom(stepperAtom);

  const onClick = () => {
    if (processingStep < config.length) {
      const timer = setInterval(() => {
        setProcessingStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep === config.length) {
            clearInterval(timer);
            setStep(2);
          }
          return nextStep;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-6 border rounded-[6px]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
          <CustomText stylearr={[12, 16, 600]}>Step 1</CustomText>
          <Image src={CsvImage} w={"24px"} h={"24px"} />
          <div className="flex flex-col gap-2">
            <CustomText stylearr={[16, 20, 700]}>
              Generate Test CSV Format
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
              Click on generate to download the CSV template for test data
            </CustomText>
          </div>
        </div>
        <CustomButton
          variant="quaternary"
          fontSize={"14px"}
          lineHeight={"18px"}
          px={6}
          h={"45px"}
          onClick={() => {
            setProcessingStep(1);
            onClick();
          }}
          isDisabled={processingStep !== 0 || step !== 1}
        >
          Generate CSV
        </CustomButton>
      </div>
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProcessingSteps config={config} step={processingStep} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default GenerateSampleCsv;
