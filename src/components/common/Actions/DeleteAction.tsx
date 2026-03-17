import { Flex, FlexProps } from "@chakra-ui/react";
import { Trash } from "react-huge-icons/outline";

interface IProp extends FlexProps {
  isDisabled?: boolean;
}

export default function DeleteAction({ isDisabled = false, ...props }: IProp) {
  const size = "30px";
  return (
    <Flex
      bgColor={"#E03137"}
      justifyContent={"center"}
      alignItems={"center"}
      w={size}
      h={size}
      borderRadius={"8px"}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      filter={isDisabled ? "brightness(3)" : "initial"}
      {...props}
    >
      <Trash style={{ fontSize: "16px" }} color="#fff" />
    </Flex>
  );
}
