import { Flex, Image } from "@chakra-ui/react";
import img from "../../../../../assets/Images/addMedia.png";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const EmptyState = () => {
  return (
    <Flex className="flex-col gap-4">
      <Image src={img} w={"200px"} h={"175px"} />
      <CustomText stylearr={[18, 28, 700]}>No Variables available</CustomText>
    </Flex>
  );
};

export default EmptyState;
