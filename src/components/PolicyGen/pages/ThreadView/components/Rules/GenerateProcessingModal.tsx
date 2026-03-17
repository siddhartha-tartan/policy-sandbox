import { Flex, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EventBus from "../../../../../../EventBus";
import CustomModal from "../../../../../common/CustomModal";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { PollingStatus } from "../../../../hooks/useGetPolicyGenData";
import usePolicyGenPolling from "../../../../hooks/usePolicyGenPolling";
import ProcessingSteps from "../../../PolicyDetail/components/ProcessingSteps";
import {
  codeRequestIdAtom,
  generatedCodeAtom,
  stepAtom,
} from "../../threadAtom";
import { PolicyGenParamsEnum } from "../../utils/constant";
export const EVENT_OPEN_GENERATE_PROCESSING = "EVENT_OPEN_GENERATE_PROCESSING";
const config = [
  "Analysing rules",
  "Understanding Query",
  "Generating code",
  "Validating Syntax",
  "Finalizing Results",
];
export default function GenerateProcessingModal() {
  const [type, setType] = useState<"generate" | "test">("generate");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [step, setStep] = useState(0);
  const location = useLocation();
  const requestId =
    useAtomValue(codeRequestIdAtom) ||
    new URLSearchParams(location.search).get(PolicyGenParamsEnum.CODE_ID)!;

  const setCode = useSetAtom(generatedCodeAtom);
  const { mutate: startPolling, data } = usePolicyGenPolling();
  useEffect(() => {
    const onOpenModal = ({ type }: { type: "test" | "generate" }) => {
      if (type) setType(type);
      onOpen();
    };
    EventBus.getInstance().addListener(
      EVENT_OPEN_GENERATE_PROCESSING,
      onOpenModal
    );
    return () => EventBus.getInstance().removeListener(onOpenModal);
  }, []);
  const setInnerStep = useSetAtom(stepAtom);

  useEffect(() => {
    if (isOpen && requestId) {
      startPolling({ requestId: requestId });
    }
  }, [isOpen, requestId]);

  useEffect(() => {
    if (data) {
      if (data?.status === PollingStatus.SUCCESS) {
        setStep(5);
        setCode(data?.response);
      }
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      if (step < config.length) {
        if (step === 4) {
          if (data) {
            setStep((prev) => prev + 1);
          }
        } else {
          const timer = setTimeout(() => {
            setStep((prev) => prev + 1);
          }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
          return () => clearTimeout(timer);
        }
      }

      // Handle navigation on the final step
      if (step === 5) {
        setTimeout(() => {
          onClose();
          if (type === "test") {
            setInnerStep(2);
          } else {
            setInnerStep(1);
          }
        }, 500); // Delay to allow exit animation to play
      }
    }
  }, [step, isOpen, type]);

  useEffect(() => {
    setStep(0);
  }, [isOpen, type]);

  return (
    <CustomModal
      w={"372px"}
      className="rounded-[16px] bg-white flex flex-col p-6"
      isOpen={isOpen}
      onClose={() => {}}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 w-full"
      >
        <Flex className="flex-col gap-2">
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
              {type === "test"
                ? "Testing the Logic of the Policy Document"
                : "Creating a Summary of the Policy Document"}
            </CustomText>
          </Flex>
        </Flex>
        <ProcessingSteps config={config} step={step} />
      </motion.div>
    </CustomModal>
  );
}
