import { CloseIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { rulesAtom, summaryAtom } from "../../../atom";
import useGetPolicyGenData, {
  PolicyGenData,
} from "../../../hooks/useGetPolicyGenData";
import ProcessingSteps from "./ProcessingSteps";

const config = [
  "Analysing content",
  "Adding to Vector Database",
  "Understanding Concepts",
  "Writing Rules",
  "Grouping Rules on Theme",
  "Presenting Rules",
];

export default function PollingModal({
  fileId,
  onClose,
  successRoute,
}: {
  fileId: string;
  onClose: () => void;
  successRoute: string;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [step, setStep] = useState<number>(0);
  const navigate = useNavigate();
  const { mutate } = useGetPolicyGenData();
  const rules = useAtomValue(rulesAtom);
  const summary = useAtomValue(summaryAtom);

  useEffect(() => {
    const timeout = setTimeout(() => {
      mutate({ fileId: fileId, queryType: PolicyGenData.RULES });
      mutate({ fileId: fileId, queryType: PolicyGenData.SUMMARY });
    }, 0);

    return () => clearTimeout(timeout);
  }, [fileId]);

  useEffect(() => {
    if (step < config.length) {
      if (step === 5) {
        if (rules && summary) {
          setStep((prev) => prev + 1);
        }
      } else {
        const timer = setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 600);
        return () => clearTimeout(timer);
      }
    }

    if (step === 6) {
      setIsExiting(true);
      setTimeout(() => navigate(successRoute), 300);
    }
  }, [step, rules, summary, fileId]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Flex h={"372px"} w={"372px"} className="flex-col p-6 gap-6 relative">
            <button
              className="absolute top-3 right-4 cursor-pointer bg-transparent border-none"
              onClick={() => {
                setIsExiting(true);
                onClose();
              }}
            >
              <CloseIcon fontSize={"14px"} />
            </button>
            <Flex className="gap-2 flex-col">
              <CustomText
                stylearr={[18, 28, 700]}
                color={"gray.900"}
                className="text-center"
              >
                Processing Your Request
              </CustomText>
              <CustomText
                stylearr={[14, 20, 500]}
                color={"gray.900"}
                className="text-center"
              >
                Creating a Summary of Policy Document
              </CustomText>
            </Flex>
            <ProcessingSteps config={config} step={step} />
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
