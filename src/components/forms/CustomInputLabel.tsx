import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FlexProps,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  Tooltip,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import P4 from "../DesignSystem/Typography/Paragraph/P4";

interface IProp extends InputProps {
  value: any;
  onChange?: (e: any) => void;
  placeholder: string;
  tooltip?: string;
  label?: string;
  leadingIcon?: JSX.Element | null;
  trailingIcon?: JSX.Element | null;
  isReadOnly?: boolean;
  activeColor?: string;
  relaxedColor?: string;
  error?: string;
  type?: string;
  prefix?: string;
  required?: boolean;
  ref?: any;
  transform?: string;
  formStyle?: FlexProps;
}

const CustomInputLabel = ({
  value,
  onChange,
  placeholder,
  tooltip,
  label = "",
  leadingIcon = null,
  trailingIcon = null,
  isReadOnly = false,
  activeColor = IS_HR_PORTAL ? getHrPortalColorConfig().primary : "#3762DD",
  relaxedColor = systemColors.br[200],
  error = "",
  type = "text",
  prefix = "",
  required = false,
  ref,
  transform = "none",
  formStyle,
  ...props
}: IProp) => {
  const [focus, setFocus] = useState(false);
  const borderColor = isReadOnly
    ? systemColors.br[50]
    : focus
      ? activeColor
      : relaxedColor;

  return (
    <Flex ref={ref} flexDir="column" gridGap="10px" {...formStyle}>
      <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[900]}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
        {tooltip && (
          <Tooltip label={tooltip} aria-label="A tooltip">
            <span className="ms-1">
              <InfoIcon />
            </span>
          </Tooltip>
        )}
      </CustomText>
      <Flex
        style={{
          flexDirection: "column",
          borderRadius: 8,
          borderWidth: 1,
          height: "40px",
        }}
        padding={"6px 10px"}
        borderColor={error ? systemColors.red.A700 : borderColor}
        sx={{
          boxShadow: focus
            ? IS_HR_PORTAL
              ? "none"
              : "-2px -2px 3px 0px rgba(55, 98, 221, 0.20), 2px 2px 2px 0px rgba(55, 98, 221, 0.20)"
            : "none",
        }}
      >
        <Flex
          style={{
            flexDirection: "row",
            flexGrow: 1,
            flexShrink: 1,
            alignItems: "center",
          }}
        >
          {leadingIcon ? (
            <Box style={{ marginRight: 8 }}>{leadingIcon}</Box>
          ) : null}
          <InputGroup gridGap={"8px"} padding={"4px"}>
            {prefix && (
              <InputLeftAddon h="25px" my="auto">
                {prefix}
              </InputLeftAddon>
            )}
            <Input
              ref={ref}
              _focusVisible={{
                outline: "none",
              }}
              variant={"unstyled"}
              isReadOnly={isReadOnly}
              value={value}
              fontSize={"14px"}
              lineHeight={"22px"}
              fontWeight={500}
              transform={transform}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.trim().length === 0) {
                  e.target.value = e.target.value.trim();
                }
                if (onChange) {
                  onChange(e);
                }
              }}
              color={
                isReadOnly
                  ? systemColors.black[400]
                  : systemColors.black.absolute
              }
              {...props}
              onFocus={(e) => {
                if (props?.onFocus) props.onFocus(e);
                setFocus(true);
              }}
              onBlur={(e) => {
                if (props?.onBlur) props.onBlur(e);
                setFocus(false);
              }}
              type={type}
              onWheel={(e) => {
                e.currentTarget.blur();
              }}
              placeholder={placeholder}
              _placeholder={{
                color: "#ABAAAD",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "22px",
              }}
            />
          </InputGroup>
        </Flex>
      </Flex>
      <Flex flexDir={"row"} gridGap={"4px"} alignItems={"center"} mt={"-8px"}>
        {trailingIcon || error ? (
          <Box style={{ marginLeft: 8 }}>
            {error ? (
              <BiErrorCircle size={14} color={systemColors.red.A700} />
            ) : (
              <>{trailingIcon}</>
            )}
          </Box>
        ) : null}
        {error != "" ? <P4 color={systemColors.red.A700}>{error}</P4> : null}
      </Flex>
    </Flex>
  );
};

export default CustomInputLabel;
