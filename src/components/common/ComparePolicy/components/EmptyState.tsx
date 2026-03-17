import { Flex, Image } from "@chakra-ui/react";
import image from "../../../../assets/Images/EmptyPolicy.png";
import CustomText from "../../../DesignSystem/Typography/CustomText";

const EmptyState = () => {
  return (
    <Flex className="flex-col gap-10 justify-center items-center h-full w-full m-auto">
      <Image src={image} w={"340px"} h={"200px"} />{" "}
      <Flex className="flex-col gap-6 items-center">
        <CustomText stylearr={[16, 22, 700]}>
          No significant differences found between the policies; if something
          seems off, a quick refresh might help.
        </CustomText>
      </Flex>
    </Flex>
  );
};

export default EmptyState;
