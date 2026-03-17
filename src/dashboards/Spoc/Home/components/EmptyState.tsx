import { Flex, Image } from "@chakra-ui/react";
import img from "../../../../assets/Images/no_task.png";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";

const EmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <Flex className="w-full h-full justify-center flex-col gap-4 text-center mx-auto items-center">
      <Image src={img} w={"160px"} h={"125px"} mx={"auto"} />
      <Flex className="flex-col gap-2">
        <CustomText stylearr={[16, 20, 700]}>{title}</CustomText>
        <CustomText stylearr={[12, 15, 500]}>{subtitle}</CustomText>
      </Flex>
    </Flex>
  );
};

export default EmptyState;
