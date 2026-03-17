import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ILoanCategory } from "../../../../hooks/useGetLoanCategories";
import { userStore } from "../../../../store/userStore";
import { customColors } from "../../../DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";

interface IProp extends Omit<MenuButtonProps, "onClick"> {
  getLabel?: string;
  onClick: (e: ILoanCategory) => void;
}

export default function SelectProductCategoryDropdown({
  getLabel = "",
  onClick,
  ...props
}: IProp) {
  const { loanCategories } = userStore();
  return (
    <Menu matchWidth={true}>
      <MenuButton
        p={"16px 20px"}
        alignItems="center"
        border={`1px solid ${customColors.GREEN_WHITE}`}
        gridGap={"16px"}
        borderRadius={"10px"}
        bgColor={systemColors.white.absolute}
        as={Button}
        rightIcon={<ChevronDownIcon />}
        transition="all 0.2s"
        w={"220px"}
        h={"40px"}
        fontSize={"14px"}
        lineHeight={"22px"}
        fontWeight={500}
        justifyContent={"flex-start"}
        {...props}
      >
        {getLabel || "Select Product Category"}
      </MenuButton>
      <MenuList maxH={"300px"} overflowY={"auto"}>
        {loanCategories?.map((item, id) => {
          return (
            <MenuItem
              key={id}
              onClick={() => onClick(item)}
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
                {item.category_type}
              </CustomText>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
