import { Flex } from "@chakra-ui/react";
import { CiCircleInfo } from "react-icons/ci";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";

export default function RestrictAnswer() {
  return (
    <Flex
      p={"12px 24px"}
      borderRadius={"12px"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"10px"}
      bgColor={systemColors.grey[100]}
      borderWidth={"1px"}
      borderColor={systemColors.grey[100]}
      color={systemColors.black[700]}
    >
      <CiCircleInfo fontSize={"20px"} />
      <CustomText stylearr={[14, 22, 700]}>
        You don't have permissions to ask queries. Please contact your SPOC to
        get access.
      </CustomText>
    </Flex>
  );
}
