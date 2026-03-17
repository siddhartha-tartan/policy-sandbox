import { Flex } from "@chakra-ui/react";
import { FileWrittenBent, FolderOpenCrooked } from "react-huge-icons/outline";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { customColors } from "../../../../DesignSystem/Colors/CustomColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const MappingIndicator = () => {
  return (
    <Flex className="flex-row gap-[56px] items-center py-2">
      <Flex className="flex-row gap-2">
        <Flex
          className="w-12 h-11 rounded-[6px] items-center justify-center"
          background={"#F3F4F6"}
        >
          <FolderOpenCrooked fontSize={"24px"} fontWeight={700} />
        </Flex>
        <Flex className="flex-col gap-1">
          <CustomText stylearr={[12, 19, 700]} color={customColors.PALE_SKY}>
            Source Variables
          </CustomText>
          <CustomText stylearr={[16, 25, 700]} color={"#0074FF"}>
            RuleSense
          </CustomText>
        </Flex>
      </Flex>
      <HiOutlineArrowRight fontSize={"20px"} color="#687588" />
      <Flex className="flex-row gap-2">
        <Flex
          className="w-12 h-11 rounded-[6px] items-center justify-center"
          background={"#F3F4F6"}
        >
          <FileWrittenBent fontSize={"24px"} fontWeight={700} />
        </Flex>
        <Flex className="flex-col gap-1">
          <CustomText stylearr={[12, 19, 700]} color={customColors.PALE_SKY}>
            Destination Variables
          </CustomText>
          <CustomText stylearr={[16, 25, 700]} color={"#0074FF"}>
            BRE
          </CustomText>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MappingIndicator;
