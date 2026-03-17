import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import CustomCheckbox from "../CustomCheckbox";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import {
  getHrPortalColorConfig,
  getDefaultColorConfig,
} from "../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showValues?: boolean;
  isSingleSelect?: boolean;
  maxVisibleItems?: number;
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className = "",
  showValues = true,
  isSingleSelect = false,
  maxVisibleItems = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get color configuration based on portal type
  const colorConfig = IS_HR_PORTAL
    ? getHrPortalColorConfig()
    : getDefaultColorConfig();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSelection = (selectedValue: string) => {
    if (isSingleSelect) {
      onChange([selectedValue]);
      setIsOpen(false);
    } else {
      const isSelected = value?.includes(selectedValue);
      const updatedValue = isSelected
        ? value.filter((v) => v !== selectedValue)
        : [...value, selectedValue];
      onChange(updatedValue);
    }
  };

  const isOptionSelected = (optionValue: string) =>
    value?.includes(optionValue);

  const shouldShowSummary = value?.length > maxVisibleItems;

  return (
    <div className={`${className}`}>
      <Menu
        isOpen={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        closeOnSelect={false}
        matchWidth
        autoSelect={false}
      >
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          isDisabled={disabled}
          border="1px solid"
          borderColor="gray.300"
          _hover={{}}
          _focus={{}}
          _active={{}}
          textAlign="left"
          px={2}
          lineHeight={"160%"}
          fontSize={"14px"}
          borderRadius={"10px"}
          className={`${
            isOpen ? `border-[${colorConfig.primary}]` : "border-grey-200"
          } h-[40px] bg-white w-full ${className}`}
          sx={{
            boxShadow: isOpen ? colorConfig.boxShadow : "none",
          }}
        >
          <Flex flexWrap="wrap" gap={2}>
            {value?.length > 0 && showValues ? (
              shouldShowSummary ? (
                <div
                  className="flex flex-row justify-between px-4 gap-[10px] rounded-[8px] h-[24px] items-center"
                  style={{
                    background: colorConfig.selectedOptionBg,
                  }}
                >
                  <Text
                    bgGradient={colorConfig.primaryTextGradient}
                    bgClip="text"
                    fontSize="12px"
                    lineHeight={"16px"}
                    fontWeight={600}
                  >
                    {value?.length} options selected
                  </Text>
                </div>
              ) : (
                value?.map((val, id) => {
                  const label = options.find(
                    (option) => option.value === val
                  )?.label;
                  return (
                    <div
                      className="flex flex-row justify-between px-4 gap-[10px] rounded-[8px] h-[24px] items-center"
                      key={val + id}
                      style={{
                        background: colorConfig.selectedOptionBg,
                      }}
                    >
                      <Text
                        bgGradient={colorConfig.primaryTextGradient}
                        bgClip="text"
                        fontSize="12px"
                        lineHeight={"16px"}
                        fontWeight={600}
                      >
                        {label}
                      </Text>
                    </div>
                  );
                })
              )
            ) : (
              <CustomText stylearr={[14, 18, 400]} color="gray.400">
                {placeholder}
              </CustomText>
            )}
          </Flex>
        </MenuButton>
        <MenuList
          maxH="200px"
          overflowY="auto"
          className="w-full"
          transition="all 0.2s ease-in-out"
        >
          {options?.map((option) => (
            <React.Fragment key={option.value}>
              <MenuItem
                _active={{
                  bg: colorConfig.menuItemHover,
                }}
                _focus={{
                  bg: colorConfig.menuItemHover,
                  outline: "none",
                }}
                _hover={{
                  bg: colorConfig.menuItemHover,
                  outline: "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection(option.value);
                }}
                my={1}
              >
                <Flex align="center" gap={2}>
                  {!isSingleSelect && (
                    <CustomCheckbox
                      color={colorConfig.checkbox}
                      isChecked={isOptionSelected(option.value)}
                    />
                  )}
                  <CustomText
                    stylearr={[12, 18, 400]}
                    color={systemColors.primary}
                  >
                    {option.label}
                  </CustomText>
                </Flex>
              </MenuItem>
            </React.Fragment>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default MultiSelectDropdown;
