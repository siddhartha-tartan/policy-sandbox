import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";

const StatsFilter = () => {
  const options = [
    { label: "AAA", value: "AAA" },
    { label: "AAA", value: "AAA" },
    { label: "AAA", value: "AAA" },
  ];
  const color = customColors.ONYX;
  return (
    <Menu placement="bottom">
      <MenuButton
        className="flex-row gap-[2px] items-center"
        alignItems="center"
        transition="all 0.2s"
        fontSize={"14px"}
        lineHeight={"16px"}
        fontWeight={500}
        color={color}
      >
        <Text> Product</Text>
        <ChevronDownIcon />
      </MenuButton>
      <MenuList
        border={`1px solid ${customColors.GREEN_WHITE}`}
        borderRadius={"10px"}
        maxH={"300px"}
        zIndex={100}
        overflowY={"auto"}
      >
        {options?.map((item) => {
          return (
            <MenuItem
              key={item.label}
              //   onClick={() => onChange(item.value)}
              _active={{
                bgColor: "none",
              }}
              _focus={{
                bgColor: "none",
                outline: "none",
              }}
              _hover={{
                bgColor: "none",
                outline: "none",
              }}
            >
              <CustomText stylearr={[14, 22, 500]} color={systemColors.primary}>
                {item.label}
              </CustomText>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default StatsFilter;
