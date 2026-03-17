import { Flex, Spinner, Textarea } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { IS_HR_PORTAL } from "../../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../../utils/getHrPortalColorConfig";
import CustomText from "../../DesignSystem/Typography/CustomText";
import useGenerateQueryResponse from "../hooks/useGenerateQueryResponse";
import { isLoadingAtom, queryAtom, selectedDbSourceAtom } from "../utils/atom";

const MotionDiv = motion.div;
const MotionFlex = motion(Flex);
const MotionTextarea = motion(Textarea);

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

export default function PromptInput({
  shouldNavigate = false,
}: {
  shouldNavigate?: boolean;
}) {
  const isLoading = useAtomValue(isLoadingAtom);
  const selectedDbSource = useAtomValue(selectedDbSourceAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [focus, setFocus] = useState(false);
  const [errorText, setErrorText] = useState<string>("");
  const hrPortalColorConfig = getHrPortalColorConfig();
  const { mutate: generateQueryResponse, buildQueryHistory } =
    useGenerateQueryResponse(shouldNavigate);

  const isDisabled = query?.trim()?.length <= 0 || isLoading;

  const onSubmit = () => {
    generateQueryResponse({
      user_query: query,
      data_source: selectedDbSource,
      query_history: buildQueryHistory(),
    });
  };

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

        <MotionTextarea
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
          placeholder={"Tell me what to do..."}
          isDisabled={isLoading}
          whileFocus={{ scale: 1.005 }}
          onKeyDown={handleKeyDown}
        />

        <MotionDiv
          variants={childVariants}
          className="w-full justify-between items-center flex"
        >
          <div />

          <MotionFlex
            variants={buttonVariants}
            whileHover={!isLoading ? "hover" : undefined}
            whileTap={!isLoading ? "tap" : undefined}
            bg={
              IS_HR_PORTAL
                ? hrPortalColorConfig.primary
                : `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`
            }
            className={`w-[33px] h-[33px] justify-center items-center flex rounded-full text-white ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            } z-[1]`}
            opacity={isDisabled && !isLoading ? 0.7 : 1}
            onClick={() => {
              if (!isLoading && !isDisabled) {
                if (query?.trim()?.length <= 0) {
                  setErrorText("Please enter a valid prompt!!");
                  return;
                }
                onSubmit();
              }
            }}
          >
            {isLoading ? (
              <Spinner size="sm" color="white" thickness="2px" />
            ) : (
              <FaArrowUp />
            )}
          </MotionFlex>
        </MotionDiv>
      </MotionDiv>
      {errorText && (
        <CustomText stylearr={[12, 16, 400]} color={"red.500"}>
          {errorText}
        </CustomText>
      )}
    </Flex>
  );
}
