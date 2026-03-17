import { Flex, forwardRef } from "@chakra-ui/react";
import { useCallback } from "react";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";
import CustomCheckbox from "../CustomCheckbox";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import { InputFieldsProps } from "./utils/data";

const CustomCheckboxInput = forwardRef((props: InputFieldsProps, ref) => {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const primaryColor = IS_HR_PORTAL ? hrPortalColorConfig.primary : "#2F78EE";

  const handleOnChange = useCallback(
    (isChecked: boolean) => {
      props.onInput({ value: isChecked, inputKey: props.inputKey });
    },
    [props]
  );

  return (
    <Flex
      flexDir="column"
      alignItems={"flex-end"}
      gap="4px"
      ref={ref}
      width="100%"
      {...props.formStyle}
    >
      <CustomCheckbox
        label={props.label}
        isChecked={!!props.value}
        setIsChecked={!props.disabled ? handleOnChange : undefined}
        color={primaryColor}
        cursor={props.disabled ? "not-allowed" : "pointer"}
        fontSize="14px"
        fontWeight="500"
      />

      {props.errorMsg && (
        <CustomText stylearr={[12, 16, 400]} color={systemColors.red[500]}>
          {props.errorMsg}
        </CustomText>
      )}
    </Flex>
  );
});

export default CustomCheckboxInput;
