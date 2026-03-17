import { Box, Flex, Input } from "@chakra-ui/react";
import { ChangeEvent, forwardRef, useCallback, useRef, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import P4 from "../DesignSystem/Typography/Paragraph/P4";
import { InputFieldsProps } from "./utils/data";

const CustomDateTimeInput = forwardRef<HTMLInputElement, InputFieldsProps>(
  (props) => {
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const [focus, setFocus] = useState(false);

    // Format as required by datetime-local (YYYY-MM-DDTHH:MM)
    const currentDateTime = new Date().toISOString().slice(0, 16);

    const formatDisplayValue = (value: any) => {
      if (!value) return "";

      if (typeof value === "number") {
        return new Date(value).toLocaleString();
      }

      if (typeof value === "string" && value.includes("T")) {
        return new Date(value).toLocaleString();
      }

      return value;
    };

    const handleDateTimeChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        props.onInput({ value, inputKey: props.inputKey });
      },
      [props]
    );

    const handleContainerClick = useCallback(() => {
      if (!props?.disabled && hiddenInputRef.current) {
        hiddenInputRef.current.focus();
        // Small delay to ensure focus is set before showing picker
        setTimeout(() => {
          if (hiddenInputRef.current?.showPicker) {
            hiddenInputRef.current.showPicker();
          }
        }, 10);
      }
    }, [props?.disabled]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Allow tab navigation and enter/escape
        if (["Tab", "Enter", "Escape"].includes(e.key)) {
          return;
        }
        // For any other key, open the picker
        e.preventDefault();
        handleContainerClick();
      },
      [handleContainerClick]
    );

    const borderColor = props?.disabled
      ? systemColors.br[50]
      : focus
      ? "#3762DD"
      : systemColors.br[200];

    return (
      <Flex flexDir="column" gridGap="10px">
        {/* Label */}
        <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[900]}>
          {props.label}
          {props.required && <span style={{ color: "red" }}>*</span>}
        </CustomText>

        {/* Input Container */}
        <Box position="relative">
          {/* Visible Display Input */}
          <Flex
            style={{
              flexDirection: "column",
              borderRadius: 8,
              borderWidth: 1,
              height: "40px",
            }}
            padding={"6px 10px"}
            borderColor={props.errorMsg ? systemColors.red.A700 : borderColor}
            sx={{
              boxShadow: focus
                ? "-2px -2px 3px 0px rgba(55, 98, 221, 0.20), 2px 2px 2px 0px rgba(55, 98, 221, 0.20)"
                : "none",
            }}
            cursor={props?.disabled ? "not-allowed" : "pointer"}
            onClick={handleContainerClick}
            onKeyDown={handleKeyDown}
            tabIndex={props?.disabled ? -1 : 0}
            role="button"
            aria-label="Open date time picker"
          >
            <Flex
              style={{
                flexDirection: "row",
                flexGrow: 1,
                flexShrink: 1,
                alignItems: "center",
              }}
            >
              <Box
                fontSize={"14px"}
                lineHeight={"22px"}
                fontWeight={500}
                color={
                  props?.disabled
                    ? systemColors.black[400]
                    : systemColors.black.absolute
                }
                flex={1}
              >
                {formatDisplayValue(props.value) || props.placeholder}
              </Box>
            </Flex>
          </Flex>

          {/* Hidden DateTime Input */}
          <Input
            ref={hiddenInputRef}
            type="datetime-local"
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            opacity={0}
            pointerEvents="none"
            value={
              typeof props.value === "number"
                ? new Date(props.value).toISOString().slice(0, 16)
                : props.value || ""
            }
            min={currentDateTime}
            onChange={handleDateTimeChange}
            onFocus={() => setFocus(true)}
            onBlur={(e) => {
              setFocus(false);
              props.onBlur({ value: e.target.value, inputKey: props.inputKey });
            }}
            disabled={props?.disabled}
          />
        </Box>

        {/* Error Message */}
        <Flex flexDir={"row"} gridGap={"4px"} alignItems={"center"} mt={"-8px"}>
          {props.errorMsg && (
            <>
              <Box style={{ marginLeft: 8 }}>
                <BiErrorCircle size={14} color={systemColors.red.A700} />
              </Box>
              <P4 color={systemColors.red.A700}>{props.errorMsg}</P4>
            </>
          )}
        </Flex>
      </Flex>
    );
  }
);

export default CustomDateTimeInput;
