import { CheckIcon, MinusIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { getHrPortalColorConfig } from "../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../utils/constants/endpoints";

interface CustomCheckboxProps {
  label?: string;
  isChecked: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  setIsChecked?: (isChecked: boolean) => void;
  fontSize?: string;
  fontWeight?: string;
  cursor?: string;
  color?: string;
  borderRadius?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label = "",
  isChecked,
  isIndeterminate = false,
  isDisabled = false,
  setIsChecked = null,
  fontSize = "14px",
  fontWeight = "500",
  cursor = "pointer",
  color = "#27A376",
  borderRadius = "6px",
}) => {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const effectiveCursor = isDisabled ? "not-allowed" : cursor;
  const opacity = isDisabled ? "0.4" : "1";
  
  return (
    <Flex gap={4} alignItems="center" opacity={opacity}>
      <Flex
        alignItems="center"
        justifyContent="center"
        w="16px"
        h="16px"
        color="#fff"
        cursor={effectiveCursor}
        bgColor={isChecked || isIndeterminate ? color : "#fff"}
        borderColor={IS_HR_PORTAL ? hrPortalColorConfig.primary : "#CBD5E0"}
        borderRadius={borderRadius}
        onClick={() => {
          if (!isDisabled && setIsChecked) {
            setIsChecked(!isChecked);
          }
        }}
        borderWidth={isChecked || isIndeterminate ? 0 : 1}
      >
        {isIndeterminate ? (
          <MinusIcon fontSize="8px" />
        ) : (
          isChecked && <CheckIcon fontSize="10px" />
        )}
      </Flex>
      {label && (
        <Text fontSize={fontSize} fontWeight={fontWeight} lineHeight="160%">
          {label}
        </Text>
      )}
    </Flex>
  );
};

export default CustomCheckbox;
