import { Button, ButtonProps } from "@chakra-ui/react";
import * as React from "react";
import { systemColors } from "./Colors/SystemColors";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";

export interface CustomButtonProps extends ButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "danger";
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

// Function to derive styles based on the variant
const getDefaultStyles = (
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "danger"
) => {
  switch (variant) {
    case "primary":
      return {
        style: { background: systemColors.black.absolute },
        color: systemColors.white.absolute,
        borderColor: systemColors.grey["200"],
        borderWidth: "1px",
      };
    case "secondary":
      return {
        style: { background: systemColors.white.absolute },
        color: systemColors.grey[700],
        border: `1px solid ${systemColors.grey[300]}`,
      };
    case "quaternary":
      return {
        style: {
          background: "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
        },
        color: systemColors.white.absolute,
        border: `1px solid ${systemColors.grey[300]}`,
      };
    case "quinary":
      return {
        style: {
          background:
            "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
        },
        color: "#176FC1",
        border: `1px solid #176FC1`,
      };
    case "danger":
      return {
        style: { background: systemColors.red["500"] },
        color: systemColors.white.absolute,
        borderColor: systemColors.red["300"],
        borderWidth: "1px",
      };
    case "tertiary":
    default:
      return {
        color: systemColors.black[900],
        style: { background: systemColors.white.absolute },
        border: `1px solid ${systemColors.grey[300]}`,
        borderRadius: "8px",
      };
  }
};

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const HR_PORTAL_PRIMARY_CONFIG = {
    style: { background: hrPortalColorConfig.primary },
    color: systemColors.white.absolute,
    borderColor: systemColors.grey["200"],
    borderWidth: "1px",
  };
  const HR_PORTAL_SECONDARY_CONFIG = {
    style: { background: systemColors.white.absolute },
    color: hrPortalColorConfig.primary,
    border: `1px solid ${hrPortalColorConfig.primary}`,
  };

  const defaultStyles = IS_HR_PORTAL
    ? variant === "primary" || variant === "quaternary"
      ? HR_PORTAL_PRIMARY_CONFIG
      : HR_PORTAL_SECONDARY_CONFIG
    : getDefaultStyles(variant);

  return (
    <Button
      justifyContent="center"
      gap="10px"
      h="45px"
      boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
      alignItems="center"
      borderRadius="10px"
      _focusVisible={{
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
      fontSize="16px"
      lineHeight="150%"
      display="flex"
      rowGap={2}
      fontWeight={500}
      {...defaultStyles}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </Button>
  );
};

export default CustomButton;
