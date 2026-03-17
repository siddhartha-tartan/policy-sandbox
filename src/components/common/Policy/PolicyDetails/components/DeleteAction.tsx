import { Flex } from "@chakra-ui/react";
import { Trash } from "react-huge-icons/outline";

export default function useDeleteAction(onOpen: () => void) {
  const config = {
    icon: (
      <Flex
        bgColor="#E03137"
        justifyContent="center"
        alignItems="center"
        w="30px"
        h="30px"
        borderRadius="8px"
      >
        <Trash style={{ fontSize: "16px" }} color="#fff" />
      </Flex>
    ),
    title: "Delete",
    onClick: onOpen,
  };

  return config;
}
