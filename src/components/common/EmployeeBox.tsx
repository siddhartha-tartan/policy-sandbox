import { Box, Flex, Text } from "@chakra-ui/react";
import * as React from "react";

interface EmployeeProps {
  name: string;
  email?: string;
}

const getInitials = (name: string): string => {
  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : nameParts[0][0];
  return initials.toUpperCase();
};

const EmployeeBox: React.FC<EmployeeProps> = ({ name, email }) => {
  const initials = getInitials(name);

  return (
    <Flex alignItems="center" gap={"12px"}>
      <Flex
        alignItems="center"
        justifyContent="center"
        bg="#CEEFDF"
        color="#27A376"
        borderRadius="50%"
        w="24px"
        h="24px"
        fontWeight="800"
        fontSize="10px"
      >
        {initials}
      </Flex>
      <Box>
        <Text
          lineHeight={"160%"}
          fontWeight="500"
          fontSize={"12px"}
          noOfLines={1}
          color="#111827"
        >
          {name}
        </Text>
        <Text
          fontSize={"10px"}
          lineHeight={"160%"}
          fontWeight={"400"}
          noOfLines={1}
          color="#A0AEC0"
        >
          {email}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmployeeBox;
