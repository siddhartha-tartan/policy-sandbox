import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import H6 from "../DesignSystem/Typography/Heading/H6";
import { InputFieldsProps } from "./utils/data";
import { IS_HR_PORTAL } from "../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../utils/getHrPortalColorConfig";

const CustomPasswordInput = (props: InputFieldsProps) => {
  const handleOnChange = useCallback((e: any) => {
    const value = e.target.value;
    props.onInput({ value, inputKey: props.inputKey });
  }, []);

  const { isOpen, onToggle } = useDisclosure();

  const [focus, setFocus] = useState(false);
  const borderColor = props?.disabled
    ? systemColors.br[50]
    : focus
    ? IS_HR_PORTAL
      ? getHrPortalColorConfig().primary
      : "#3726DD"
    : systemColors.br[200];

  return (
    <Flex gridGap={"10px"} flexDir={"column"} className={props?.className}>
      {props.label ? (
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <H6 color={systemColors.grey[900]}>
            {props.label}
            {props.required && (
              <chakra.span color={systemColors.error[600]}>*</chakra.span>
            )}
          </H6>
        </Flex>
      ) : (
        <></>
      )}
      <Flex
        style={{
          flexDirection: "column",
          borderRadius: 8,
          borderWidth: 1,
        }}
        padding={"6px 10px"}
        borderColor={borderColor}
        sx={{
          boxShadow: focus
            ? IS_HR_PORTAL
              ? "none"
              : "-2px -2px 3px 0px rgba(55, 98, 221, 0.20), 2px 2px 2px 0px rgba(55, 98, 221, 0.20)"
            : "none",
        }}
      >
        <InputGroup gridGap={"8px"} padding={"4px"}>
          <Input
            value={props.value}
            _focusVisible={{
              outline: "none",
            }}
            variant={"unstyled"}
            onChange={handleOnChange}
            required={props?.required}
            fontSize={"14px"}
            lineHeight={"22px"}
            fontWeight={500}
            placeholder={props.placeholder}
            onWheel={(e) => {
              e.currentTarget.blur();
            }}
            isDisabled={props.disabled}
            type={isOpen ? "text" : "password"}
            _placeholder={{
              color: "#A0AEC0",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "22px",
            }}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
          />
          <InputRightElement my="auto" alignItems={"center"} h="100%">
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <FaEye /> : <FaEyeSlash />}
              aria-label={""}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
      {props?.message && (
        <CustomText stylearr={[14, 20, 500]} color={systemColors.grey["400"]}>
          {props.message}
        </CustomText>
      )}
    </Flex>
  );
};

export default CustomPasswordInput;
