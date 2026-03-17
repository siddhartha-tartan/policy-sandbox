import { Flex, Image } from "@chakra-ui/react";
import analysingAnimation from "../../../../../assets/Animations/analysingAnimation.gif";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../CustomModal";
interface IProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function AnalysingModal({ isOpen, onClose }: IProps) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex
        flexDir="column"
        p="24px"
        borderRadius="12px"
        w="500px"
        h={"415px"}
        gap="32px"
        alignItems="center"
      >
        <Flex
          gap={"20px"}
          w={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDir={"column"}
        >
          <Flex flexDir={"column"} gap={2}>
            <CustomText textAlign={"center"} stylearr={[24, 38, 700]}>
              Analysing your assessment result
            </CustomText>
            <CustomText
              textAlign={"center"}
              color={systemColors.grey[600]}
              stylearr={[16, 25, 500]}
            >
              We are analysing your test
            </CustomText>
          </Flex>
        </Flex>
        <Flex>
          <Image src={analysingAnimation} />
        </Flex>
      </Flex>
    </CustomModal>
  );
}
