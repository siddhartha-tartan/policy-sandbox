import React from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface IProps extends TextProps {
  readonly stylearr?: [number, number, number];
  readonly children?: React.ReactNode;
}

export default function CustomText(props: IProps) {
  const stylearr =
    Array.isArray(props?.stylearr) && props?.stylearr?.length === 3
      ? props?.stylearr
      : [16, 24, 400];
  const fontSize = `${stylearr[0]}px`;
  const lineHeight = `${stylearr[1]}px`;
  const fontWeight = stylearr[2];

  return (
    <Text
      className={"outfit"}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      {...props}
    >
      {props.children}
    </Text>
  );
}
