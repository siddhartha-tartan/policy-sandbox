import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import { InputFieldsProps, OPTION } from "./utils/data";
import React from "react";

const CustomMultiSelect = forwardRef((props: InputFieldsProps) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (props.options) {
      const temp = props.options.reduce<Record<string, boolean>>(
        (acc, item) => {
          acc[item.value] = props?.value?.length && props?.value?.find(
            (element: string) => element === item.value
          )
            ? true
            : false;
          return acc;
        },
        {}
      );
      setSelectedOptions(temp);
    }
  }, []);

  const anyValueSelected = useMemo(() => {
    let ans = false;
    Object.values(selectedOptions).forEach((item) => {
      if (item) ans = true;
    });
    return ans;
  }, [selectedOptions]);

  const handleCheckboxChange = (item: OPTION) => {
    let prevData = selectedOptions;
    const updatedData = { ...prevData, [item.value]: !prevData[item.value] };
    setSelectedOptions(updatedData);
    props.onInput({
      value: Object.keys(updatedData).filter(
        (key) => updatedData[key] === true
      ),
      inputKey: props.inputKey,
    });
  };

  return (
    <Flex flexDir="column" gridGap="10px">
      <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[900]}>
        {props.label}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </CustomText>
      <Menu matchWidth={true} closeOnSelect={false} closeOnBlur={true}>
        <MenuButton
          p={"9px 20px"}
          alignItems="center"
          border={`1px solid ${customColors.GREEN_WHITE}`}
          gridGap={"16px"}
          borderRadius={"10px"}
          h={"-webkit-fit-content"}
          bgColor={systemColors.white.absolute}
          as={Button}
          transition="all 0.2s"
          isDisabled={props.disabled}
          textAlign={"left"}
        >
          <Flex
            flexDir={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gridGap={"8px"}
          >
            {anyValueSelected ? (
              <Flex
                flexDir={"row"}
                gridGap={"12px"}
                flexWrap={"wrap"}
                alignItems={"center"}
              >
                {Object.entries(selectedOptions).map(([key, value]) => {
                  if (value) {
                    const getLabel =
                      props.options?.filter((row) => row.value === key)?.[0]
                        ?.label || "";
                    return (
                      <CustomText
                        key={`${getLabel}${key}${value}`}
                        stylearr={[14, 22, 600]}
                        p={"8px"}
                        color={systemColors.indigo[500]}
                        bg={systemColors.indigo[50]}
                        borderRadius={"8px"}
                      >
                        {getLabel}
                      </CustomText>
                    );
                  }
                })}
              </Flex>
            ) : (
              <CustomText
                stylearr={[14, 22, 500]}
                color={
                  props.disabled
                    ? systemColors.black[500]
                    : systemColors.primary
                }
              >
                {props.placeholder}
              </CustomText>
            )}

            <ChevronDownIcon />
          </Flex>
        </MenuButton>
        <MenuList maxH={"300px"} overflowY={"auto"}>
          {props.options?.map((item, id) => {
            return (
              <React.Fragment key={`${item.label}${id}options`}>
                <MenuItem
                  key={id}
                  _active={{ bg: "transparent" }}
                  _focus={{ bg: "transparent", outline: "none" }}
                  _hover={{ bg: "transparent", outline: "none" }}
                >
                  <Flex flexDir="row" gridGap="12px">
                    <Checkbox
                      size="md"
                      isChecked={!!selectedOptions[item.value]}
                      onChange={() => handleCheckboxChange(item)}
                      style={{
                        opacity: 1,
                        cursor: "default",
                        color: "#575DF1",
                      }}
                    />
                    <CustomText
                      stylearr={[14, 22, 500]}
                      color={systemColors.primary}
                      onClick={() => handleCheckboxChange(item)}
                    >
                      {item.label}
                    </CustomText>
                  </Flex>
                </MenuItem>
                {id !== props.options!.length - 1 && <MenuDivider />}
              </React.Fragment>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
});

export default CustomMultiSelect;
