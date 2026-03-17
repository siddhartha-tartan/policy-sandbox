import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import { InputFieldsProps } from "./utils/data";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";

const CustomSelectInput = (props: InputFieldsProps) => {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleOnChange = useCallback(
    (value: string) => {
      props.onInput({ value, inputKey: props.inputKey });
    },
    [props.onInput, props.inputKey]
  );
  const getLabel =
    props?.options?.filter((row) => row.value === props?.value)?.[0]?.label ||
    "";
  return (
    <Flex
      flexDir={"column"}
      gridGap={"10px"}
      className={props?.className}
      {...props.formStyle}
    >
      <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[900]}>
        {props.label}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </CustomText>
      <Flex
        flexDir={"row"}
        justifyContent={"space-between"}
        p={"12px 20px"}
        alignItems="center"
        border={`1px solid ${
          isMenuOpen
            ? IS_HR_PORTAL
              ? hrPortalColorConfig.primary
              : "#3762DD"
            : customColors.GREEN_WHITE
        }`}
        gridGap={"16px"}
        borderRadius={"10px"}
        minW={"170px"}
        cursor={props.disabled ? "not-allowed" : "pointer"}
        h={"40px"}
        sx={{
          boxShadow: isMenuOpen
            ? IS_HR_PORTAL
              ? "none"
              : "-2px -2px 3px 0px rgba(55, 98, 221, 0.20), 2px 2px 2px 0px rgba(55, 98, 221, 0.20)"
            : "none",
        }}
      >
        {props?.value ? (
          <Flex
            flexDir={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            w={"full"}
          >
            <CustomText
              stylearr={[14, 22, 500]}
              color={
                props.disabled ? systemColors.black[500] : systemColors.primary
              }
            >
              {getLabel}
            </CustomText>

            <CloseIcon
              fontSize={"9px"}
              cursor={props.disabled ? "not-allowed" : "pointer"}
              onClick={() => {
                if (props.disabled) return;
                handleOnChange("");
              }}
            />
          </Flex>
        ) : (
          <Menu
            matchWidth={true}
            onOpen={() => setIsMenuOpen(true)}
            onClose={() => setIsMenuOpen(false)}
          >
            <MenuButton
              transition="all 0.2s"
              w={"full"}
              disabled={props.disabled || false}
            >
              <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <CustomText
                  stylearr={[14, 22, 400]}
                  color={props.disabled ? systemColors.black[500] : "#ABAAAD"}
                >
                  {getLabel || props.placeholder}
                </CustomText>

                <ChevronDownIcon />
              </Flex>
            </MenuButton>
            <MenuList maxH={"200px"} overflowY={"auto"}>
              {props?.options?.map((item, id) => {
                return (
                  <MenuItem
                    key={id}
                    onClick={() => {
                      handleOnChange(item.value);
                    }}
                    _active={{
                      bg: IS_HR_PORTAL
                        ? hrPortalColorConfig.secondary
                        : "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
                    }}
                    _focus={{
                      bg: IS_HR_PORTAL
                        ? hrPortalColorConfig.secondary
                        : "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
                      outline: "none",
                    }}
                    _hover={{
                      bg: IS_HR_PORTAL
                        ? hrPortalColorConfig.secondary
                        : "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
                      outline: "none",
                    }}
                    my={1}
                  >
                    <CustomText
                      stylearr={[12, 18, 400]}
                      color={systemColors.primary}
                    >
                      {item.label}
                    </CustomText>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
};

export default CustomSelectInput;
