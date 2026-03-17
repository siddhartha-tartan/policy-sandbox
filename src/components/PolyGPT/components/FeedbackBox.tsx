import { CloseButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import EventBus from "../../../EventBus";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomText from "../../DesignSystem/Typography/CustomText";
import { EVENT_SUBMIT_FEEDBACK } from "../hooks/useFeedback";
import { ConversationMessage } from "../hooks/useGetMessages";
import { EVENT_OPEN_FEEDBACK_MODAL } from "./CustomFeedbackModal";

export default function FeedbackBox({
  onClose,
  feedback,
  conversationMessage,
}: {
  onClose: () => void;
  feedback: string;
  conversationMessage: ConversationMessage;
}) {
  return (
    <div className="w-full border-[1px] border-[#E4E7EC] bg-[#F8F9FA] rounded-[10px] p-4 gap-[10px] flex flex-col relative">
      <CloseButton onClick={onClose} className="absolute top-2 right-2" />
      <CustomText stylearr={[12, 32, 500]} color={"#263238"}>
        Tell us more:
      </CustomText>
      <div className="w-full gap-4 flex items-center flex-wrap">
        {[
          `Don't like the style`,
          `Not factually correct`,
          `Didn't fully follow instructions`,
        ].map((row, id) => {
          return (
            <motion.div
              key={id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                EventBus.getInstance().fireEvent(EVENT_SUBMIT_FEEDBACK, {
                  entity: "ConversationMessage",
                  entity_id: conversationMessage?.message_id,
                  user_prompt: conversationMessage?.prompt,
                  ai_output: conversationMessage?.response,
                  user_feedback: feedback,
                  user_feedback_reason: row,
                  lang_graph_link: "",
                });
                onClose();
              }}
              className="cursor-pointer"
            >
              <CustomText
                stylearr={[14, 14, 600]}
                className="text-[#1B2559] py-2 px-3 rounded-[8px] border-[#E5E6E6] border-[1px]"
              >
                {row}
              </CustomText>
            </motion.div>
          );
        })}
        <CustomButton
          style={{
            background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
          }}
          onClick={() => {
            EventBus.getInstance().fireEvent(EVENT_OPEN_FEEDBACK_MODAL, {
              conversationMessage,
              feedback,
            });
            onClose();
          }}
          h={"34px"}
          rounded={"8px"}
        >
          Custom Reply
        </CustomButton>
      </div>
    </div>
  );
}
