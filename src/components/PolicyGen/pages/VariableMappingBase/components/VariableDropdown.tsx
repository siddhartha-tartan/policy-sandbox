import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { customColors } from "../../../../DesignSystem/Colors/CustomColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const MotionChevronIcon = motion(ChevronDownIcon);

const VariableDropdown = ({
  options,
  onSelect,
  setSearchQuery,
}: {
  options: string[];
  onSelect: (selectedVar: string) => void;
  setSearchQuery: (e: string) => void;
}) => {
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu
      placement="auto"
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <MenuButton className="cursor-pointer">
        <Flex className="flex-row items-center gap-[2px] cursor-pointer">
          <CustomText stylearr={[12, 20, 500]}>Select</CustomText>
          <MotionChevronIcon
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Flex>
      </MenuButton>

      <MenuList
        border={`1px solid ${customColors.GREEN_WHITE}`}
        borderRadius={"10px"}
        overflowY={"auto"}
        zIndex={20}
      >
        {/* Search Bar */}
        <Flex p={2}>
          <Input
            placeholder="Search Variable"
            className="rounded-[6px] py-[10px] px-[14px] text-sm	font-medium"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </Flex>

        {/* Filtered Options */}
        <Box maxH={"150px"} overflowY={"auto"}>
          {options?.length > 0 ? (
            options?.map((item) => (
              <MenuItem
                key={item}
                className="border-b"
                alignItems="flex-start" // Align items to the start
                onClick={(e) => {
                  e.stopPropagation(); // Prevent menu from closing
                  onSelect(item || "");
                }}
              >
                <CustomText
                  stylearr={[14, 18, 500]}
                  className="py-2 pl-2 text-start" // Add `text-start` for additional alignment
                  color={"#37474F"}
                >
                  {item}
                </CustomText>
                {/* <Divider /> */}
              </MenuItem>
            ))
          ) : (
            <Flex justifyContent="center" p={3}>
              <CustomText stylearr={[14, 20, 500]} color={"#687588"}>
                No results found
              </CustomText>
            </Flex>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
};

export default VariableDropdown;
