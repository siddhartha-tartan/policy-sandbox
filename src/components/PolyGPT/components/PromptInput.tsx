import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Input, Textarea } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import EventBus from "../../../EventBus";
import {
  EVENT_OPEN_MULTIPLE_POLICY_SELECTION,
  MultiplePolicySelectionModal,
  MultiplePolicySelection,
} from "../../common/MultiplePolicySelectionModal";
import CustomText from "../../DesignSystem/Typography/CustomText";
import { isLoadingAtom, queryAtom, selectedPoliciesAtom } from "../polygptAtom";
import { IS_HR_PORTAL, isAbfl } from "../../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../../utils/getHrPortalColorConfig";

const MotionDiv = motion.div;
const MotionFlex = motion(Flex);
const MotionTextarea = motion(Textarea);
const MotionInput = motion(Input);
const MotionIcon = motion(ChevronDownIcon);

export default function PromptInput({
  placeholder = "Tell AI what prompt you need, e.g. get customers who signed up previous month and their purchases..",
  onSubmit,
  textAreaInput = true,
}: Readonly<{
  placeholder?: string;
  onSubmit: Function;
  textAreaInput?: boolean;
}>) {
  const isLoading = useAtomValue(isLoadingAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [focus, setFocus] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useAtom(selectedPoliciesAtom);
  const [errorText, setErrorText] = useState<string>("");
  const hrPortalColorConfig = getHrPortalColorConfig();
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  };

  const shimmerVariants = {
    hidden: { opacity: 0, scale: 0.95, width: 0, height: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
      width: "30%",
      height: "50%",
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
      width: 0,
      height: 0,
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, rotate: 15 },
    tap: { scale: 0.9, rotate: -15 },
  };

  const iconVariants = {
    hover: { y: -5 },
    tap: { y: 0 },
  };

  // const isDisabled = selectPolicy
  //   ? !(selectedPolicy && query?.trim()?.length > 0)
  //   : query?.trim()?.length <= 0

  const isDisabled =
    query?.trim()?.length <= 0 ||
    isLoading ||
    (isAbfl && (!selectedPolicies || selectedPolicies?.length === 0));

  const InputBox = textAreaInput ? MotionTextarea : MotionInput;

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !isLoading && !isDisabled) {
      if (event.shiftKey) {
        return;
      }
      // Prevent default Enter behavior
      event.preventDefault();

      if (query?.trim()?.length <= 0) {
        setErrorText("Please enter a valid prompt!!");
        return;
      }

      onSubmit();
    }
  };

  const onOpen = () => {
    EventBus.getInstance().fireEvent(EVENT_OPEN_MULTIPLE_POLICY_SELECTION);
  };

  return (
    <Flex className="flex-col gap-2 w-full">
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full py-4 px-5 ${
          focus || isLoading ? "border-[1px]" : ""
        } rounded-[10px] gap-4 flex flex-col relative`}
        style={{
          backgroundColor: isLoading
            ? IS_HR_PORTAL
              ? hrPortalColorConfig.backgroundHover
              : "#e4eaf4"
            : "white",

          transition: "all 0.3s ease",
          boxShadow: `0px 4px 20px 0px rgba(0, 0, 0, 0.06)`,
        }}
      >
        <AnimatePresence>
          {focus && !isLoading && (
            <>
              <MotionDiv
                variants={shimmerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`absolute top-[-1.5px] left-[-1.5px] rounded-tl-[10px] pt-[2px] pl-[2px] ${
                  !IS_HR_PORTAL ? "shimmer-background" : "shimmer-hr-background"
                }`}
              >
                <div
                  className="w-full h-full rounded-tl-[10px]"
                  style={{
                    backgroundColor: IS_HR_PORTAL
                      ? hrPortalColorConfig.conversationBg
                      : "#fff",
                  }}
                />
              </MotionDiv>
              <MotionDiv
                variants={shimmerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`absolute bottom-[-1.5px] right-[-1.5px] w-[30%] h-[50%] rounded-br-[10px] pb-[2px] pr-[2px] ${
                  !IS_HR_PORTAL ? "shimmer-background" : "shimmer-hr-background"
                }`}
              >
                <div
                  className="w-full h-full rounded-br-[10px]"
                  style={{
                    backgroundColor: IS_HR_PORTAL
                      ? hrPortalColorConfig.conversationBg
                      : "#fff",
                  }}
                />
              </MotionDiv>
            </>
          )}
        </AnimatePresence>

        <InputBox
          variants={childVariants}
          value={query}
          onFocus={() => {
            setFocus(true);
            setErrorText("");
          }}
          onBlur={() => setFocus(false)}
          onChange={(e) => setQuery(e.target.value)}
          resize={"none"}
          className="w-full text-[12px] font-[500] leading-[19px] border-none focus-visible:border-none active:border-none focus:border-none focus:outline-none active:outline-none focus-visible:outline-none p-0 focus:ring-0 bg-[transparent]"
          placeholder={placeholder}
          isDisabled={isLoading}
          whileFocus={{ scale: 1.005 }}
          onKeyDown={handleKeyDown}
        />

        <MotionDiv
          variants={childVariants}
          className="w-full justify-between items-center flex"
        >
          <MotionDiv
            whileHover={{
              scale: 1.05,
              color: IS_HR_PORTAL
                ? hrPortalColorConfig.textSecondary
                : "#2E3A59",
            }}
            whileTap={{
              scale: 0.95,
              color: IS_HR_PORTAL ? hrPortalColorConfig.primary : "#1D3577",
            }}
            className={`flex gap-2 items-center font-[500] text-[12px] cursor-pointer w-[200px]`}
            style={{
              color: selectedPolicies?.length
                ? IS_HR_PORTAL
                  ? hrPortalColorConfig.primary
                  : "#0074FF"
                : IS_HR_PORTAL
                ? hrPortalColorConfig.textMuted
                : "#687588",
            }}
            onClick={() => {
              if (isLoading) return;
              setErrorText("");
              onOpen();
            }}
          >
            {selectedPolicies?.length ? (
              <p
                style={{
                  color: IS_HR_PORTAL ? hrPortalColorConfig.primary : "#0074FF",
                }}
              >
                {selectedPolicies?.length === 1
                  ? selectedPolicies?.[0]?.policy_name
                  : `${selectedPolicies?.length} Policies Selected`}
              </p>
            ) : isAbfl ? (
              <p>
                Select Product Category{" "}
                <span className={"text-[#DD2C00]"}>*</span>
              </p>
            ) : (
              <p>{"Select Policy"}</p>
            )}
            <MotionIcon
              variants={iconVariants}
              fontSize={"16px"}
              style={{
                color: selectedPolicies?.length
                  ? IS_HR_PORTAL
                    ? hrPortalColorConfig.primary
                    : "#0074FF"
                  : IS_HR_PORTAL
                  ? hrPortalColorConfig.textMuted
                  : "#687588",
              }}
            />
          </MotionDiv>

          <MotionFlex
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            bg={
              IS_HR_PORTAL
                ? hrPortalColorConfig.primary
                : `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`
            }
            className={`w-[33px] h-[33px] justify-center items-center flex rounded-full text-white ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            } z-[1]`}
            opacity={isDisabled ? 0.7 : 1}
            onClick={() => {
              if (!selectedPolicies || !selectedPolicies?.length) {
                setErrorText("Please select a policy document!!");
                return;
              }
              if (!isLoading && !isDisabled) {
                if (query?.trim()?.length <= 0) {
                  setErrorText("Please enter a valid prompt!!");
                  return;
                }
                onSubmit();
              }
            }}
          >
            <FaArrowUp />
          </MotionFlex>
        </MotionDiv>
      </MotionDiv>
      {errorText && (
        <CustomText stylearr={[12, 16, 400]} color={"red.500"}>
          {errorText}
        </CustomText>
      )}
      <MultiplePolicySelectionModal
        setSelectedPolicies={(policies: MultiplePolicySelection[]) =>
          setSelectedPolicies(policies)
        }
        currentSelectedPolicies={selectedPolicies}
      />
    </Flex>
  );
}
