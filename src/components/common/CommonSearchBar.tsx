import { useState, useEffect, memo } from "react";
import { ChakraProps, Flex, Input } from "@chakra-ui/react";
import { Search, RemoveThin } from "react-huge-icons/outline";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

interface CommonSearchBarProps extends ChakraProps {
  handleChange: (value: string) => void;
  placeholder: string;
  searchText?: string;
  className?: string;
}

const CommonSearchBar = ({
  handleChange,
  placeholder,
  searchText = "",
  className = "",
  ...props
}: CommonSearchBarProps) => {
  const [inputValue, setInputValue] = useState<string>(searchText);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleChange(inputValue);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler); // Clear timeout if the user types within 300ms
    };
  }, [inputValue, handleChange]);

  const clearInput = () => {
    setInputValue("");
    handleChange("");
  };

  return (
    <Flex
      padding="16px 20px"
      border={`1px solid ${customColors.GREEN_WHITE}`}
      borderRadius={"10px"}
      justifyContent={"center"}
      flexDir={"row"}
      gap={"10px"}
      alignItems={"center"}
      className={className}
      {...props}
    >
      <Search color={systemColors.grey[400]} fontSize={"20px"} />
      <Input
        variant={"unstyled"}
        fontSize={"14px"}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        flexGrow={1}
        placeholder={placeholder}
        _placeholder={{ fontSize: "14px", lineHeight: "22px", fontWeight: 400 }}
      />
      {inputValue && (
        <RemoveThin
          color={systemColors.grey[900]}
          fontSize={"24px"}
          cursor="pointer"
          onClick={clearInput}
        />
      )}
    </Flex>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(CommonSearchBar);
