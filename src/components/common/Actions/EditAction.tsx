import { Flex, FlexProps } from "@chakra-ui/react";
import { Pencil } from "react-huge-icons/outline";

export default function EditAction(props: FlexProps) {
  const size = "30px";
  return (
    <Flex
      bgColor={"#2F78EE"}
      justifyContent={"center"}
      alignItems={"center"}
      w={size}
      h={size}
      borderRadius={"8px"}
      cursor={"pointer"}
      {...props}
    >
      <Pencil style={{ fontSize: "16px" }} color="#fff" />
    </Flex>
  );
}
