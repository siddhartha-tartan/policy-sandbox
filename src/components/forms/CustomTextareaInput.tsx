import { InfoIcon } from "@chakra-ui/icons";
import { chakra, Flex, Tooltip } from "@chakra-ui/react";
import { useCallback } from "react";
import CustomTextarea from "../common/CustomTextarea";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import H5 from "../DesignSystem/Typography/Heading/H5";
import P3 from "../DesignSystem/Typography/Paragraph/P3";
import { InputFieldsProps } from "./utils/data";

const CustomTextareaInput = (props: InputFieldsProps) => {
  const handleOnChange = useCallback((e: any) => {
    const value = e.target.value;
    props.onInput({ value, inputKey: props.inputKey });
  }, []);

  if (props.label) {
    return (
      <Flex gridGap={"10px"} flexDir={"column"} className={props?.className}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <H5 color={systemColors.grey[900]}>
            {props.label}
            {props.required && (
              <chakra.span color={systemColors.error[600]}>*</chakra.span>
            )}
            {props.tooltip && (
              <Tooltip label={props.tooltip} aria-label="A tooltip">
                <span className="ms-1">
                  <InfoIcon />
                </span>
              </Tooltip>
            )}
          </H5>
          {props.errorMsg && (
            <P3 color={systemColors.error[600]}>{props.errorMsg}</P3>
          )}
        </Flex>
        <CustomTextarea
          value={props.value}
          flexGrow={1}
          placeholder={props.placeholder}
          onChange={handleOnChange}
          outline={"none"}
          isDisabled={props?.disabled || false}
          _focus={{ boxShadow: "none" }}
        />
      </Flex>
    );
  }
};

export default CustomTextareaInput;
