import { Flex } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout: React.FC = () => {
  return (
    <Flex w="100vw" minH="100vh" overflowX={"hidden"} flexDir="column">
      <Outlet />
    </Flex>
  );
};

export default PublicLayout;
