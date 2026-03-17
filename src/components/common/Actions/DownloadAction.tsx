import { Flex, FlexProps } from "@chakra-ui/react";
import { BiDownload } from "react-icons/bi";

export default function DownloadAction(props: FlexProps) {
  const size = "30px";
  return (
    <Flex
      bgColor={"orange"}
      justifyContent={"center"}
      alignItems={"center"}
      w={size}
      h={size}
      borderRadius={"8px"}
      cursor={"pointer"}
      {...props}
    >
      <BiDownload style={{ fontSize: "16px" }} color="#fff" />
    </Flex>
  );
}
