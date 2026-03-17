import { Box, Flex, Icon } from "@chakra-ui/react";
import { ComponentType, ReactNode } from "react";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";

interface IProps {
  data: {
    icon: ComponentType;
    title: string;
    value: string | number;
    filterComp: ReactNode;
  };
  index: number;
}

const StatsCard = ({ data }: IProps) => {
  const color = customColors.ONYX;

  return (
    <Flex className={`flex-col gap-6 grow`}>
      <Flex className="flex-row w-full justify-between">
        <Flex className="flex-row gap-2 items-center">
          <Box
            className="flex rounded-lg items-center justify-center w-9 h-9"
            bg={"#E3E9FA"}
          >
            <Icon as={data.icon} color={color} fontSize={"24px"} />
          </Box>
          <CustomText stylearr={[14, 18, 600]} color={color}>
            {data.title}
          </CustomText>
        </Flex>

        {data?.filterComp ? (
          <Flex minW={"120px"} justifyContent={"flex-end"}>
            {data.filterComp}
          </Flex>
        ) : null}
      </Flex>
      <CustomText stylearr={[40, 44, 700]} color={color}>
        {data.value}
      </CustomText>
    </Flex>
  );
};

export default StatsCard;
