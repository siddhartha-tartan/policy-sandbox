import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { IOption } from "../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";

type TSimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

interface IDropDownExclusiveProps {
  title?: string;
  options: IOption[];
  value: string;
  onChange: (e: string) => void;
  isDisabled?: boolean;
  matchWidth?: boolean;
  isResetAble?: boolean;
}

interface IDropdownProps
  extends TSimpleSpread<MenuButtonProps, IDropDownExclusiveProps> {}

const CommonDropdownComponent = ({
  title = "",
  options,
  value,
  onChange,
  isDisabled = false,
  matchWidth = true,
  isResetAble = false,
  ...props
}: IDropdownProps) => {
  const getLabel =
    options?.filter((row) => row.value === value)?.[0]?.label || "";
  return (
    <Menu matchWidth={matchWidth}>
      {isResetAble && value ? (
        <Box
          className="flex flex-row justify-between items-center gap-4"
          px="4"
          py="5"
          minW="170px"
          h="full"
          bg="white"
          border="1px solid"
          borderColor={customColors.GREEN_WHITE}
          borderRadius="10px"
          fontSize="14px"
          lineHeight="22px"
          fontWeight={500}
          {...props}
        >
          {getLabel || value}{" "}
          <CloseIcon
            fontSize={"10px"}
            cursor={"pointer"}
            onClick={() => onChange("")}
          />
        </Box>
      ) : (
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
          color={systemColors.primary}
          {...props}
        >
          {getLabel || value || title}
        </MenuButton>
      )}

      <MenuList
        border={`1px solid ${customColors.GREEN_WHITE}`}
        borderRadius={"10px"}
        maxH={"250px"}
        zIndex={100}
        overflowY={"auto"}
      >
        {options?.map((item, id) => {
          return (
            <MenuItem
              key={id}
              onClick={() => onChange(item.value)}
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

export default CommonDropdownComponent;
