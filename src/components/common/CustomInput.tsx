import { Input, InputProps } from "@chakra-ui/react";

export default function CustomInput({ ...props }: InputProps) {
  return (
    <Input
      px={5}
      py={4}
      lineHeight={"160%"}
      fontSize={"14px"}
      borderRadius={"10px"}
      {...props}
    />
  );
}
