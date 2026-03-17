import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import SuccessUserIcon from "../../../../../../assets/Icons/SuccessUserIcon";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";

export default function ResultProfileNumbers({
  errorProfile,
  successProfile,
}: {
  errorProfile: number;
  successProfile: number;
}) {
  const successPer = (
    (successProfile / (successProfile + errorProfile)) *
    100
  ).toFixed(1);

  return (
    <Flex className="p-6 rounded-[6px] border-[1px] border-[#D0D5DD] gap-6 items-center">
      <Flex
        className="min-w-[84px] min-h-[84px] w-[84px] h-[84px] rounded-[8.6px] justify-center items-center"
        bg={
          "radial-gradient(99.8% 99.8% at 7.69% 9.62%, #2688E4 0%, #063057 100%)"
        }
      >
        <SuccessUserIcon />
      </Flex>
      <Flex className="gap-[14px] flex flex-col w-full">
        <Flex className="flex-col">
          <CustomText stylearr={[14, 22, 600]} color={"#98A2B3"}>
            Success Rate
          </CustomText>
          <Flex className="gap-2 items-end">
            <CustomText color={"#242424"} stylearr={[36, 48, 700]}>
              {successPer.toString() === "NaN" ? 0 : successPer}%
            </CustomText>
            <CustomText stylearr={[18, 30, 600]} color={"#176FC1"}>
              ({successProfile}/{successProfile + errorProfile} Profiles)
            </CustomText>
          </Flex>
        </Flex>
        <Flex className="h-[12px] bg-[#E5F1FF] w-full rounded-[1000px] overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{
              width: `${successPer}%`,
            }}
            transition={{
              ease: "easeOut",
              duration: 0.5,
            }}
            className="h-full bg-[#176FC1]"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
