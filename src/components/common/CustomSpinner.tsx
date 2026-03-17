import { Flex, Spinner } from "@chakra-ui/react";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

interface CUSTOM_SPINNER_PROPS {
  height?: number;
  align?: string;
  thickness?: number;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CustomSpinner: React.FC<CUSTOM_SPINNER_PROPS> = ({
  height = 90,
  color = systemColors.primary,
  size = "md",
  align = "center",
  thickness = 2,
}) => {
  return (
    <Flex height={`${height}vh`} justifyContent={align} alignItems={align}>
      <Spinner
        thickness={`${thickness}px`}
        speed="0.75s"
        emptyColor="gray.200"
        color={color}
        size={size}
      />
    </Flex>
  );
};

export default CustomSpinner;
