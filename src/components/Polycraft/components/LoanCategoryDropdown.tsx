import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { customColors } from "../../DesignSystem/Colors/CustomColors";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";

export interface Option {
  value: string;
  label: string;
}

interface LoanCategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  isDisabled?: boolean;
  w?: string;
  placeholder?: string;
  type: "category" | "subCategory";
  className?: string;
}

const LoanCategoryDropdown: React.FC<LoanCategoryDropdownProps> = ({
  value,
  onChange,
  options,
  isDisabled = false,
  w = "full",
  placeholder = "Select option",
  className = "",
}) => {
  const selectedValue = options?.find((opt) => opt.value === value)?.label;
  return (
    <Menu isLazy matchWidth>
      <MenuButton
        p={"16px 20px"}
        alignItems="center"
        border={`1px solid ${customColors.GREEN_WHITE}`}
        gridGap={"16px"}
        borderRadius={"10px"}
        minW={"170px"}
        h={"full"}
        bgColor={systemColors.white.absolute}
        as={Button}
        rightIcon={<ChevronDownIcon />}
        transition="all 0.2s"
        isDisabled={isDisabled}
        textAlign={"left"}
        fontSize={"14px"}
        lineHeight={"22px"}
        fontWeight={500}
        color={selectedValue ? "#37474F" : "#A0AEC0"}
        className={className}
      >
        {selectedValue || placeholder}
      </MenuButton>

      <MenuList w={w} borderRadius="md" shadow="md">
        <VStack
          divider={<StackDivider />}
          className="p-2"
          maxH={"250px"}
          overflowY={"auto"}
        >
          {options?.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              _hover={{ bg: "#F8F9FA", borderRadius: "4px" }}
              className="py-[10px] px-3 text-[12px] font-[500] text-[#37474F]"
            >
              {option.label}
            </MenuItem>
          ))}
        </VStack>
      </MenuList>
    </Menu>
  );
};

export default LoanCategoryDropdown;
