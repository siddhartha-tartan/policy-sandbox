import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { customColors } from "../../../DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";

interface VersionOption {
  label: string;
  value: string;
  status: string;
  date: string;
  isDisabled: boolean;
}

interface VersionDropdownProps {
  title: string;
  options: VersionOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const VersionDropdown = ({
  title,
  options,
  value,
  onChange,
  placeholder = "Select version",
}: VersionDropdownProps) => {
  const selectedOption = options.find((option) => option.value === value);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "successful":
        return "green.500";
      case "processing":
        return "orange.500";
      case "failed":
        return "#E64A19";
      default:
        return "gray.500";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status?.toLowerCase()) {
      case "successful":
        return "✅";
      case "processing":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "●";
    }
  };

  return (
    <Box>
      {title && (
        <CustomText
          stylearr={[14, 20, 600]}
          color={systemColors.grey[900]}
          mb={2}
        >
          {title}
        </CustomText>
      )}
      <Menu matchWidth>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          p="16px 20px"
          alignItems="center"
          border={`1px solid ${customColors.GREEN_WHITE}`}
          borderRadius="10px"
          minW="100%"
          h="46px"
          bgColor={systemColors.white.absolute}
          transition="all 0.2s"
          textAlign="left"
          fontSize="14px"
          lineHeight="22px"
          fontWeight={500}
          color={systemColors.primary}
          _hover={{
            borderColor: systemColors.primary,
          }}
          _active={{
            borderColor: systemColors.primary,
          }}
        >
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Text>{selectedOption ? selectedOption.label : placeholder}</Text>
            {selectedOption && (
              <Flex alignItems="center" gap={1}>
                <Text
                  fontSize="12px"
                  color={getStatusColor(selectedOption.status)}
                >
                  {getStatusEmoji(selectedOption.status)}
                </Text>
              </Flex>
            )}
          </Flex>
        </MenuButton>

        <MenuList
          border={`1px solid ${customColors.GREEN_WHITE}`}
          borderRadius="10px"
          maxH="300px"
          zIndex={100}
          overflowY="auto"
          p={0}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => !option.isDisabled && onChange(option.value)}
              p="12px 16px"
              opacity={option.isDisabled ? 0.5 : 1}
              cursor={option.isDisabled ? "not-allowed" : "pointer"}
              _hover={{
                bgColor: option.isDisabled
                  ? "transparent"
                  : systemColors.grey[50],
              }}
              _focus={{
                bgColor: option.isDisabled
                  ? "transparent"
                  : systemColors.grey[50],
              }}
            >
              <Flex
                justifyContent="space-between"
                alignItems="center"
                w="100%"
                gap={3}
              >
                <Flex alignItems="center" gap={2}>
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    color={
                      option.isDisabled
                        ? systemColors.grey[400]
                        : systemColors.grey[900]
                    }
                  >
                    {option.label}
                  </Text>
                  <Text
                    fontSize="12px"
                    color={getStatusColor(option.status)}
                    fontWeight="500"
                  >
                    {getStatusEmoji(option.status)} {option.status}
                  </Text>
                </Flex>
                <Text
                  fontSize="12px"
                  color={
                    option.isDisabled
                      ? systemColors.grey[400]
                      : systemColors.grey[600]
                  }
                  flexShrink={0}
                >
                  {option.date}
                </Text>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default VersionDropdown;
