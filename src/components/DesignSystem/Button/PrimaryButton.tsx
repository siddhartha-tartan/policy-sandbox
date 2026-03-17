import { Button, ButtonProps } from "@chakra-ui/react";
import { systemColors } from "../Colors/SystemColors";

const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button
      className={"bg-grey-900"}
      p={"16px 40px"}
      justifyContent={"center"}
      color={systemColors.white.absolute}
      gap={"10px"}
      alignItems={"center"}
      borderRadius={"12px"}
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
      fontSize={"16px"}
      lineHeight={"24px"}
      fontWeight={500}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default PrimaryButton;
