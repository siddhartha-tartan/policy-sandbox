import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import AnimatedSkeleton from "../AnimatedSkeleton";

export default function Chat({
  isYou,
  isLoading = false,
  data = "",
}: {
  isYou: boolean;
  isLoading?: boolean;
  data?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="w-full select-none"
    >
      {isLoading ? (
        <AnimatedSkeleton borderRadius={"12px"} h={"50px"} />
      ) : (
        <Flex
          className="border-[1px] border-[#F3F2F5] rounded-[12px] gap-1 p-4 w-full flex-col"
          bg={isYou ? "#fff" : "#EDF1FF"}
          color={"#1B2559"}
        >
          <CustomText stylearr={[12, 20, 700]}>
            {isYou ? "You" : "PolicyGen"}
          </CustomText>
          <CustomText stylearr={[12, 20, 400]}>{data}</CustomText>
        </Flex>
      )}
    </motion.div>
  );
}
