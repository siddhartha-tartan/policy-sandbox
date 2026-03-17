import { Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import loading from "../../../../../../../assets/Images/loading.gif";

export default function ProcessingSteps({
  config,
  step,
}: {
  config: string[];
  step: number;
}) {
  const renderState = (index: number) => {
    if (index < step) {
      // Success state
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg
            width="11"
            height="12"
            viewBox="0 0 11 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="5.5"
              cy="6.29102"
              r="5.5"
              fill="url(#paint0_linear_3433_91264)"
            />
            <circle cx="5.5" cy="6.29102" r="2.75" fill="white" />
            <defs>
              <linearGradient
                id="paint0_linear_3433_91264"
                x1="-6.82369e-08"
                y1="-0.736761"
                x2="18.9569"
                y2="0.95861"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3762DD" />
                <stop offset="1" stop-color="#1D3577" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      );
    } else if (index === step) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{
            yoyo: Infinity,
            duration: 0.6,
          }}
        >
          <Image
            src={loading}
            alt="Loading"
            w={"12px"}
            h={"12px"}
            color={"#3762DD"}
          />
        </motion.div>
      );
    } else {
      // Pending state
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg
            width="11"
            height="12"
            viewBox="0 0 11 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5.5" cy="6.29102" r="5.5" fill="#E1E1E3" />
            <circle cx="5.5" cy="6.29102" r="2.75" fill="#ABAAAD" />
          </svg>
        </motion.div>
      );
    }
  };
  return (
    <Flex className="flex-col gap-2 w-full">
      {config?.map((row, id) => (
        <Flex key={id} className="gap-2 items-center">
          <Flex className="w-[11px] h-[11px]">{renderState(id + 1)}</Flex>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CustomText
              stylearr={[14, 20, step > id ? 600 : 500]}
              color={step > id ? "#111827" : "#ABAAAD"}
            >
              {row}
            </CustomText>
          </motion.div>
        </Flex>
      ))}
    </Flex>
  );
}
