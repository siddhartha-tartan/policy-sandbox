import { Flex, FlexProps } from "@chakra-ui/react";
import EyeSVG from "../../../assets/Icons/EyeSvg copy";

export default function ViewAction(props: FlexProps) {
  const size = "30px";
  return (
    <Flex
      bgColor={"#27A376"}
      justifyContent={"center"}
      alignItems={"center"}
      w={size}
      cursor={"pointer"}
      h={size}
      borderRadius={"8px"}
      {...props}
    >
      <EyeSVG style={{ fontSize: "16px" }} color="#fff" />
    </Flex>
  );
}
