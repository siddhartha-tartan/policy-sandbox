import { Flex, Progress } from "@chakra-ui/react";
import CustomText from "../../../DesignSystem/Typography/CustomText";

export default function ImportingFaqModal() {
  return (
    <Flex w={"425px"} p={6} bg={"white"} gap={6} className="flex-col">
      <CustomText stylearr={[20, 28, 600]} textAlign={"center"}>
        Processing and Importing FAQs
      </CustomText>
      <Progress size="xs" isIndeterminate />
      <CustomText stylearr={[18, 28, 400]} textAlign={"center"}>
        This might take 1 - 2 minutes
      </CustomText>
    </Flex>
  );
}
