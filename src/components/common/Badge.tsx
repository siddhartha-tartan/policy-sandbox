import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

interface BadgeProps extends FlexProps {
  text: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Badge({
  text,
  leftIcon,
  rightIcon,
  ...props
}: BadgeProps) {
  return (
    <Flex
      bg={systemColors.blue[50]}
      color={systemColors.blue[500]}
      borderRadius="6px"
      px={"8px"}
      h="32px"
      display="flex"
      fontSize={"14px"}
      fontWeight={"700"}
      justifyContent={"center"}
      alignItems="center"
      gap={2}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      <Text>{text}</Text>
      {rightIcon && <span>{rightIcon}</span>}
    </Flex>
  );
}
