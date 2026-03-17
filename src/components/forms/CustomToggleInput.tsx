import { Flex, forwardRef, Switch } from "@chakra-ui/react";
import CustomText from "../DesignSystem/Typography/CustomText";
import { InputFieldsProps } from "./utils/data";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { useCallback } from "react";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";

const CustomToggleInput = forwardRef((props: InputFieldsProps, ref) => {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const handleOnChange = useCallback((value: boolean) => {
    props.onInput({ value, inputKey: props.inputKey });
  }, []);

  return (
    <Flex
      flexDir={props.inLine ? "row" : "column"}
      gridGap={props.inLine ? "20px" : "10px"}
      ref={ref}
    >
      <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[900]}>
        {props.label}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </CustomText>
      <Flex
        flexDir={"row"}
        justifyContent={"space-between"}
        p={props.hideBorder ? "0" : "8px 24px"}
        border={
          props.hideBorder ? "none" : `1px solid ${customColors.GREEN_WHITE}`
        }
        borderRadius={"8px"}
      >
        <CustomText stylearr={[14, 22, 500]} color={systemColors.black[800]}>
          {props.placeholder}
        </CustomText>
        <Flex flexDir={"row"} gridGap={"12px"}>
          <Switch
            size="md"
            colorScheme="blue"
            sx={{
              "& .chakra-switch__track[data-checked]": {
                backgroundColor: IS_HR_PORTAL
                  ? hrPortalColorConfig.primary
                  : "#2F78EE",
              },
            }}
            isChecked={props?.value || false}
            disabled={props.disabled}
            onChange={() => {
              handleOnChange(!props?.value);
            }}
          />
          <CustomText stylearr={[14, 22, 600]}>
            {props.valueMapper?.[props?.value] || ""}
          </CustomText>
        </Flex>
      </Flex>
    </Flex>
  );
});

export default CustomToggleInput;
