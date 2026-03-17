import { Flex } from "@chakra-ui/react";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import AddNewPolicy from "./AddNewPolicy";
import { userStore } from "../../store/userStore";

const DashboardContentBase = ({ children }: { children: React.ReactNode }) => {
  const { name } = userStore();
  return (
    <Flex
      flexDir="column"
      p={"13px 24px 60px 24px"}
      gridGap="13px"
      bg={systemColors.black[50]}
      minW={"100%"}
      minH={"100%"}
    >
      <Flex justifyContent="space-between" alignItems={"center"}>
        <Flex flexDir={"column"} gridGap={"8px"}>
          <CustomText stylearr={[24, 31, 700]} color={systemColors.primary}>
            👋 Hi, {name}!
          </CustomText>
          <CustomText stylearr={[14, 22, 500]} color={customColors.PALE_SKY}>
            You will see all the major analytics here
          </CustomText>
        </Flex>
        <AddNewPolicy />
      </Flex>
      {children}
    </Flex>
  );
};

export default DashboardContentBase;
