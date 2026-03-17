import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import RuleIcon from "../../../../../../assets/Icons/RuleIcon";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { useAtomValue } from "jotai";
import { breRulesAtom } from "../../threadAtom";

const MotionFlex = motion(Flex);
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.2,
    },
  },
};

const ruleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const BreRules = () => {
  const breRules = useAtomValue(breRulesAtom);

  return (
    <MotionFlex
      className="w-full h-full py-6 flex-col flex overflow-y-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Flex className="flex-col gap-6">
        {breRules?.map((item) => (
          <MotionFlex
            key={item.name + "bre"}
            className="p-4 flex-col gap-3 border rounded-[16px]"
            variants={ruleVariants}
          >
            <Flex className="flex-row w-full justify-between">
              <Flex className="flex-row gap-2 items-center">
                <RuleIcon />
                <CustomText stylearr={[13, 20, 800]}>{item?.name}</CustomText>
              </Flex>
              <Flex
                className="flex-row gap-[10px] px-4 py-2 items-center rounded-[8px]"
                background={"#FAFAFA"}
              >
                <CustomText stylearr={[13, 22, 700]} color={"37474F"}>
                  Trigger
                </CustomText>
                <CustomText stylearr={[13, 19, 500]} color={"37474F"}>
                  {item?.trigger}
                </CustomText>
              </Flex>
            </Flex>
            <Flex className="flex-row gap-4">
              <MotionFlex
                className="p-4 flex-col gap-[10px] rounded-[12px] flex-1"
                background={"#FAFAFA"}
                variants={ruleVariants}
              >
                <CustomText stylearr={[14, 22, 700]}>Condition</CustomText>
                {item?.rules?.map((cond, index) => (
                  <CustomText
                    stylearr={[13, 18, 700]}
                    key={cond?.name + index}
                    className="p-2 border rounded-[6px] text-balance"
                    color={"#37474F"}
                    background={"#FFF"}
                    wordBreak={"break-all"}
                  >
                    {cond?.description}
                  </CustomText>
                ))}
              </MotionFlex>
              <MotionFlex
                className="p-4 flex-col gap-[10px] rounded-[12px] flex-1"
                background={"#FAFAFA"}
                variants={ruleVariants}
              >
                <CustomText stylearr={[14, 22, 700]}>Action</CustomText>
                <CustomText
                  stylearr={[13, 18, 700]}
                  className="p-2 border rounded-[6px] text-balance w-fit"
                  color={"#37474F"}
                  background={"#FFF"}
                  wordBreak={"break-all"}
                >
                  {item?.action}
                </CustomText>
              </MotionFlex>
            </Flex>
          </MotionFlex>
        ))}
      </Flex>
    </MotionFlex>
  );
};

export default BreRules;
