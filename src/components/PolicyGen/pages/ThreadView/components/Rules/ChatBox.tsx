import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Grid, Image, Textarea } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import ChatSvg from "../../../../../../assets/Icons/ChatSvg";
import StarLineIcon from "../../../../../../assets/Icons/StarLineIcon";
import loadingImage from "../../../../../../assets/Images/chat_loading.gif";
import EventBus from "../../../../../../EventBus";
import { queryClient } from "../../../../../../ProviderWrapper";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import {
  rulesAtom,
  rulesLoadingAtom,
  summaryLoadingAtom,
} from "../../../../atom";
import usePolicyGenPolling from "../../../../hooks/usePolicyGenPolling";
import useAskQuery from "../../hooks/useAskQuery";
import useGetChatPrompts, {
  getchatPromptsKey,
} from "../../hooks/useGetChatPrompts";
import useGetEditRules from "../../hooks/useGetEditRules";
import { isChatOpenAtom, ruleEditKeyAtom } from "../../threadAtom";
import { isNoRule } from "../../utils/helpers";
import SaveFirstPopover from "../SaveFirstPopover";
import { EVENT_ADD_RULE } from "./AddRuleModal";
import Chat from "./Chat";

// Mask Component
const Mask = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Grid
      templateColumns={"repeat(4,1fr)"}
      className="h-[50%] absolute left-0 w-full top-[-10%] z-[1]"
      bgColor={"rgba(225, 182, 232, 0.28)"}
    >
      {Array.from({ length: 12 }, (_, id) => {
        return (
          <Flex
            borderColor={"rgba(225, 182, 232, 0.28)"}
            bgColor={id === 7 ? "rgba(225, 182, 232, 0.28)" : "transparent"}
            borderWidth={"0.2px"}
            filter={"brightness(1.1)"}
          />
        );
      })}
      <Flex className="absolute w-[200%] left-[-50%] h-full bg-white top-[160px] backdrop-blur-xl filter blur-[31px] transform scale-y-[-1]" />
    </Grid>
  </motion.div>
);

// Main ChatBox Component with Animations
export default function ChatBox() {
  const { data: chatPrompts } = useGetChatPrompts();
  const [prompt, setPrompt] = useState("");
  const rulesData = useAtomValue(rulesAtom);
  const ruleEditKey = useAtomValue(ruleEditKeyAtom);
  const isRulesLoading = useAtomValue(rulesLoadingAtom);
  const isSummaryLoading = useAtomValue(summaryLoadingAtom);
  const { mutate, isLoading } = useGetEditRules();
  const { mutate: postQuery, isLoading: isQueryLoading } = useAskQuery();
  const { mutate: startPolling, isLoading: isPolling } = usePolicyGenPolling();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isUpdateRuleLoading = isLoading || isRulesLoading || isSummaryLoading;
  const isAskQueryLoading = isQueryLoading || isPolling;

  useEffect(() => {
    if (!isUpdateRuleLoading && !isAskQueryLoading)
      queryClient.refetchQueries(getchatPromptsKey);
  }, [isUpdateRuleLoading, isAskQueryLoading]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatPrompts, isUpdateRuleLoading, isAskQueryLoading]);
  const setIsChatOpen = useSetAtom(isChatOpenAtom);
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="overflow-y-auto  min-w-[313px] w-[313px]"
      transition={{ duration: 0.5 }}
    >
      <Flex className="w-[313px] h-full rounded-[12px] bg-white relative overflow-y-auto overflow-x-hidden">
        <Mask />
        <Flex className="flex-col z-[2] w-full overflow-y-auto">
          <Flex className="items-center gap-4 mt-[19px] ml-[21px] ">
            <Flex className="max-w-[60px] w-[60px] max-h-[60px] h-[60px] items-center justify-center">
              <ChatSvg />
            </Flex>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex-col gap-3 flex"
            >
              <Flex className="gap-1 items-center flex text-[#263238]">
                <StarLineIcon />
                <CustomText stylearr={[20, 30, 700]} color={"#263238"}>
                  PolicyGen
                </CustomText>
              </Flex>
              <CustomText stylearr={[14, 22, 500]} color={"#667085"}>
                Ask PolicyGen Anything
              </CustomText>
            </motion.div>
            <CloseIcon
              color={"#667085"}
              fontSize={"12px"}
              onClick={() => setIsChatOpen(false)}
              className="cursor-pointer"
            />
          </Flex>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={containerRef}
            transition={{ duration: 0.3, delay: 0.5 }}
            className={`flex-grow w-full mt-[64px] pb-[16px] overflow-y-auto px-[20px] flex gap-4 flex-col`}
          >
            {isUpdateRuleLoading || isAskQueryLoading ? (
              <Image src={loadingImage} alt="Loading" mt={"-64px"} />
            ) : (
              chatPrompts?.map((row, id) => (
                <React.Fragment key={`${row.prompt}-${id}`}>
                  <Chat isYou data={row.prompt} />
                  <Chat isYou={false} data={row.response} />
                </React.Fragment>
              ))
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="px-[25px] pb-[11px] w-full flex-col gap-[17px] flex"
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              resize={"none"}
              placeholder="Type your message here..."
              className="w-full h-[125px] overflow-y-auto border-[1px] border-[#E0E1E6] rounded-[8px]"
            />
            <Flex className="gap-[17px] items-center">
              <CustomButton
                variant="secondary"
                h={"47px"}
                flex={1}
                isDisabled={!prompt || isAskQueryLoading}
                isLoading={isAskQueryLoading}
                onClick={() => {
                  postQuery(
                    { prompt },
                    {
                      onSuccess(successData) {
                        if (successData?.id) {
                          setPrompt("");
                          startPolling({ requestId: successData?.id });
                        }
                      },
                    }
                  );
                }}
              >
                <CustomText stylearr={[14, 20, 600]}>Ask Query</CustomText>
              </CustomButton>
              <SaveFirstPopover showContent={!!ruleEditKey}>
                <CustomButton
                  style={{
                    background: `linear-gradient(95deg, ${systemColors.indigo[350]} -1.14%, ${systemColors.indigo[600]} 158.31%)`,
                  }}
                  flex={1}
                  h={"47px"}
                  isDisabled={!prompt || isUpdateRuleLoading}
                  isLoading={isUpdateRuleLoading}
                  onClick={() => {
                    if (!ruleEditKey) {
                      if (rulesData && isNoRule(rulesData)) {
                        EventBus.getInstance().fireEvent(EVENT_ADD_RULE);
                        return;
                      }
                      mutate(
                        { queryType: "update", prompt },
                        {
                          onSuccess() {
                            setPrompt("");
                          },
                        }
                      );
                    }
                  }}
                >
                  <CustomText stylearr={[14, 20, 600]}>Update Rules</CustomText>
                </CustomButton>
              </SaveFirstPopover>
            </Flex>
          </motion.div>
        </Flex>
      </Flex>
    </motion.div>
  );
}
