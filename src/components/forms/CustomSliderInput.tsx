import {
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  forwardRef,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import { InputFieldsProps } from "./utils/data";

interface SliderInputProps extends InputFieldsProps {
  min?: number;
  max?: number;
  step?: number;
}

const CustomSliderInput = forwardRef((props: SliderInputProps, ref) => {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const primaryColor = IS_HR_PORTAL ? hrPortalColorConfig.primary : "#2F78EE";

  const handleOnChange = useCallback(
    (val: number) => {
      props.onInput({ value: val, inputKey: props.inputKey });
    },
    [props]
  );

  return (
    <Flex flexDir="column" gap="8px" ref={ref} width="100%">
      {/* Label Row with dynamic value display */}
      <Flex justifyContent="space-between" alignItems="center">
        <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[900]}>
          {props.label}
          {props.required && (
            <span style={{ color: "red", marginLeft: "2px" }}>*</span>
          )}
        </CustomText>
        <CustomText stylearr={[14, 22, 600]} color={primaryColor}>
          {props.value ?? 0}
        </CustomText>
      </Flex>

      {/* Slider Component */}
      <Slider
        aria-label={props.label}
        defaultValue={props.value}
        value={props.value}
        min={props.min || 0}
        max={props.max || 1}
        step={props.step || 0.1}
        onChange={handleOnChange}
        isDisabled={props.disabled}
        focusThumbOnChange={false}
      >
        <SliderTrack bg={systemColors.grey[300]} h="4px" borderRadius="full">
          <SliderFilledTrack bg={primaryColor} />
        </SliderTrack>
        <SliderThumb
          boxSize={5}
          bg={primaryColor}
          border={`2px solid white`}
          boxShadow="0px 2px 4px rgba(0,0,0,0.2)"
          _focus={{ boxShadow: "outline" }}
        />
      </Slider>
    </Flex>
  );
});

export default CustomSliderInput;
