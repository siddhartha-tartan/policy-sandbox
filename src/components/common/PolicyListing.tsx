import { Flex, SimpleGrid } from "@chakra-ui/react";
import { userStore } from "../../store/userStore";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import PolicyBox from "./Policy/PolicyBox";

const PolicyListing = () => {
  const { loanCategories: config } = userStore();
  if (config?.length === 0) return null;
  return (
    <Flex
      borderRadius={"16px"}
      flexDir={"column"}
      p={"24px"}
      gridGap={"24px"}
      bg={systemColors.white.absolute}
    >
      <Flex flexDir={"column"} gridGap={"8px"}>
        <CustomText stylearr={[24, 31, 700]} color={systemColors.primary}>
          Policies
        </CustomText>
        <CustomText stylearr={[14, 22, 500]} color={customColors.PALE_SKY}>
          All the policies list
        </CustomText>
      </Flex>
      <SimpleGrid columns={3} gap={"24px"}>
        {config?.map((row, id) => (
          <PolicyBox data={row} key={id} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default PolicyListing;
