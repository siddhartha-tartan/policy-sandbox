import { Textarea, TextareaProps } from "@chakra-ui/react";

export default function CustomTextarea({ ...props }: TextareaProps) {
  return (
    <Textarea
      px={5}
      py={4}
      lineHeight={"160%"}
      fontSize={"14px"}
      borderRadius={"10px"}
      {...props}
    />
  );
}
