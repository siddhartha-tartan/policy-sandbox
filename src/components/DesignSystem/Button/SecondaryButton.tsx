import { Button, ButtonProps } from "@chakra-ui/react";
import { systemColors } from "../Colors/SystemColors";

const SecondaryButton = (props: ButtonProps) => {
  return (
    <Button
      p={"16px 40px"}
      justifyContent={"center"}
      gap={"10px"}
      bg={systemColors.white.absolute}
      alignItems={"center"}
      borderRadius={"12px"}
      border={`1px solid ${systemColors.grey[300]}`}
      _focus={{
        transition: "all 250ms linear",
        filter: "brightness(1.1)",
        bgColor: "none",
      }}
      _active={{
        transition: "all 250ms linear",
        filter: "brightness(0.90)",
        bgColor: "none",
      }}
      _hover={{
        transition: "all 250ms ease-out",
        filter: "brightness(1.1)",
      }}
      isDisabled={props?.isDisabled}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default SecondaryButton;
