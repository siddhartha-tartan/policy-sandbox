import { CloseButton, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EventBus from "../../../EventBus";
import CustomModal from "../../common/CustomModal";
import CustomTextarea from "../../common/CustomTextarea";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomText from "../../DesignSystem/Typography/CustomText";
import { EVENT_SUBMIT_FEEDBACK } from "../hooks/useFeedback";
import { ConversationMessage } from "../hooks/useGetMessages";
export const EVENT_OPEN_FEEDBACK_MODAL = "EVENT_OPEN_FEEDBACK_MODAL";
export default function CustomFeedbackModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [conversationMessage, setConversationMessage] =
    useState<ConversationMessage>();
  const [feedback, setFeedback] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  useEffect(() => {
    const onModalOpen = ({
      conversationMessage,
      feedback,
    }: {
      conversationMessage: ConversationMessage;
      feedback: string;
    }) => {
      setConversationMessage(conversationMessage);
      setFeedback(feedback);
      onOpen();
    };

    EventBus.getInstance().addListener(EVENT_OPEN_FEEDBACK_MODAL, onModalOpen);
    return () => {
      EventBus.getInstance().removeListener(onModalOpen);
    };
  }, []);

  const handleSubmit = () => {
    EventBus.getInstance().fireEvent(EVENT_SUBMIT_FEEDBACK, {
      entity: "ConversationMessage",
      entity_id: conversationMessage?.message_id,
      user_prompt: conversationMessage?.prompt,
      ai_output: conversationMessage?.response,
      user_feedback: feedback,
      user_feedback_reason: reply,
      lang_graph_link: "",
    });
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 rounded-md flex flex-col gap-6 relative min-w-[517px]">
        <CustomText stylearr={[20, 32, 700]}>Custom Reply</CustomText>
        <CloseButton onClick={onClose} className="absolute top-2 right-2" />

        <CustomTextarea
          value={reply}
          placeholder="Type here"
          onChange={(e) => setReply(e.target.value)}
        />
        <CustomButton
          className="w-fit"
          isDisabled={!reply}
          onClick={() => {
            handleSubmit();
          }}
        >
          Save
        </CustomButton>
      </div>
    </CustomModal>
  );
}
