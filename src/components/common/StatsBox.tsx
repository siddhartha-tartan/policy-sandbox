import { Flex, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IStats } from "../../dashboards/Admin/Home/utils/config";
import { abflColors, systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import { isAbfl } from "../../utils/constants/endpoints";

const MotionFlex = motion(Flex); // Motion-enhanced Flex component

export default function StatsBox({ data }: { data: IStats }) {
  return (
    <MotionFlex
      flexDir={"column"}
      gap={"16px"}
      initial={{ opacity: 0, y: 20 }} // Animation for initial appearance
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }} // Hover animation
    >
      <Flex className="flex-row justify-between items-start">
        {" "}
        <MotionFlex
          padding="16px"
          borderRadius={"12px"}
          w={"52px"}
          bgColor={isAbfl ? abflColors.primary : "#3762DD"}
          justifyContent={"center"}
          alignItems={"center"}
          h={"52px"}
          boxShadow={`0px -8px 16px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 8.5px 0px rgba(255, 255, 255, 0.60) inset`}
          my={"auto"}
          whileHover={{
            backgroundColor: isAbfl ? abflColors.primary : "#4a73f5", // Slightly lighter shade on hover
          }}
        >
          <Icon as={data.icon} width={"20px"} height={"20px"} color={"#fff"} />
        </MotionFlex>
        {data?.filterComp}
      </Flex>

      <CustomText stylearr={[32, 40, 700]} color={systemColors.primary}>
        {data.number}
      </CustomText>
      <CustomText stylearr={[14, 22, 600]} color={systemColors.primary}>
        {data.title}
      </CustomText>
    </MotionFlex>
  );
}
