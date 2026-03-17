import { Flex, useToast, Image, CloseButton } from "@chakra-ui/react";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import WarningImage from "../../assets/Images/WarningImage.png";
import SuccessImage from "../../assets/Images/SuccessImage.png";
import CustomText from "../DesignSystem/Typography/CustomText";

export default function CustomToast() {
  const toast = useToast();
  const toastId = new Date().getTime().toString();
  const customToast = (title: string, type: "SUCCESS" | "ERROR") => {
    toast({
      id: toastId,
      position: "top-right",
      title: title,
      duration: 5000,
      render: () => (
        <Flex
          p={"16px"}
          border={`1px solid ${systemColors.grey[100]}`}
          borderRadius={"12px"}
          bg={systemColors.white.absolute}
          boxShadow={
            "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)"
          }
          flexDir={"row"}
          gridGap={"20px"}
          alignItems={"center"}
          zIndex={10000}
          w={"-webkit-fit-content"}
        >
          <Image
            w={"40px"}
            h={"40px"}
            src={type === "SUCCESS" ? SuccessImage : WarningImage}
          />
          <CustomText stylearr={[14, 20, 700]} color={systemColors.grey[900]}>
            {title}
          </CustomText>
          <CloseButton onClick={() => toast.close(toastId)} />
        </Flex>
      ),
    });
  };
  return {
    customToast,
  };
}
