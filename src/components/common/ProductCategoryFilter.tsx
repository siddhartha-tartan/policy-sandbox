import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { userStore } from "../../store/userStore";
import CustomText from "../DesignSystem/Typography/CustomText";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

const MotionChevronIcon = motion(ChevronDownIcon);

const ProductCategoryFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const { loanCategories } = userStore();
  const [isOpen, setIsOpen] = useState(false);

  const options = useMemo(
    () => [
      { label: "All Categories", value: "" },
      ...(loanCategories?.map((item) => ({
        label: item.category_type,
        value: item.id,
      })) || []),
    ],
    [loanCategories]
  );

  const getLabel =
    options?.filter((row) => row.value === value)?.[0]?.label || "";

  return (
    <Menu
      placement="bottom"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <MenuButton className="cursor-pointer">
        <Flex className="flex-row items-center gap-[2px] cursor-pointer">
          <CustomText stylearr={[16, 16, 600]}>{getLabel}</CustomText>

          {/* Chevron animation */}
          <MotionChevronIcon
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Flex>
      </MenuButton>

      <MenuList
        border={`1px solid ${customColors.GREEN_WHITE}`}
        borderRadius={"10px"}
        maxH={"200px"}
        zIndex={100}
        overflowY={"auto"}
      >
        {options?.map((item, id) => {
          return (
            <MenuItem
              key={id}
              onClick={() => onChange(item.value)}
              _active={{
                bgColor: "#E8EAF6",
                color: "#3F51B5",
              }}
              _focus={{
                bgColor: "#E8EAF6",
                color: "#3F51B5",
              }}
              _hover={{
                bgColor: "#E8EAF6",
                color: "#3F51B5",
              }}
            >
              <CustomText stylearr={[13, 22, 500]} color={systemColors.primary}>
                {item.label}
              </CustomText>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ProductCategoryFilter;
