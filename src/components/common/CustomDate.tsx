import { Input, InputProps } from "@chakra-ui/react";
import { FormTypes } from "../forms/utils/data";

type ReadonlyInputProps = Readonly<InputProps>;

export default function CustomDate({ ...props }: ReadonlyInputProps) {
  return (
    <Input
      type={FormTypes.DATE}
      px={5}
      py={4}
      lineHeight={"160%"}
      fontSize={"14px"}
      borderRadius={"10px"}
      {...props}
    />
  );
}
