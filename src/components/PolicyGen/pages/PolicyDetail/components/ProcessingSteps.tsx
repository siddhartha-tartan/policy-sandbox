import { Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import loading from "../../../../../assets/Images/loading.gif";
import ring from "../../../../../assets/Images/ring.png";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
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
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              fill="#388E3C"
            />
          </svg>
        </motion.div>
      );
    } else if (index === step) {
      // Loading state
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{
            yoyo: Infinity,
            duration: 0.6,
          }}
        >
          <Image src={loading} alt="Loading" />
        </motion.div>
      );
    } else {
      // Pending state
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image src={ring} alt="Pending" />
        </motion.div>
      );
    }
  };

  return (
    <Flex className="flex-col gap-5 w-full">
      {config?.map((row, id) => (
        <Flex key={id} className="gap-3 items-center">
          <Flex className="w-[24px] h-[24px]">{renderState(id)}</Flex>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: id * 0.1 }}
          >
            <CustomText
              stylearr={[14, 20, step > id ? 600 : 500]}
              color={step > id ? "#388E3C" : "#555557"}
            >
              {row}
            </CustomText>
          </motion.div>
        </Flex>
      ))}
    </Flex>
  );
}
