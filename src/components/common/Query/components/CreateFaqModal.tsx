import { CloseIcon } from "@chakra-ui/icons";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventBus from "../../../../EventBus";
import { userStore } from "../../../../store/userStore";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import CustomInput from "../../CustomInput";
import CustomModal from "../../CustomModal";
import CustomToast from "../../CustomToast";
import useAddFaq from "../../Faq/hooks/useAddFaq";
import { discussionAtom } from "../queryAtom";
export const EVENT_OPEN_CREATE_FAQ_MODAL = "EVENT_OPEN_CREATE_FAQ_MODAL";
export default function CreateFaqModal() {
  const { id } = useParams<{ id: string }>();
  const { loanCategories } = userStore();
  const name =
    loanCategories?.find((item) => item.id === id)?.category_type || "";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const setDiscussionId = useSetAtom(discussionAtom);
  useEffect(() => {
    const onModalOpen = ({
      question,
      answer,
    }: {
      question: string;
      answer: string;
    }) => {
      setQuestion(question);
      setAnswer(answer);
      onOpen();
    };
    EventBus.getInstance().addListener(
      EVENT_OPEN_CREATE_FAQ_MODAL,
      onModalOpen
    );
    return () => EventBus.getInstance().removeListener(onModalOpen);
  }, []);
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useAddFaq();
  const handleSave = () => {
    if (id) {
      mutate([{ query_text: question, answer_text: answer, category_id: id }], {
        onSuccess() {
          setDiscussionId(null);
          onClose();
          customToast("FAQ added successfully", "SUCCESS");
        },
      });
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      w={"572px"}
      className="p-6 gap-6"
    >
      <Flex className="w-full justify-between items-center">
        <Flex className="items-center gap-6">
          <CustomText stylearr={[24, 31, 700]}>Create FAQ</CustomText>
          <CustomText
            className="bg-[#304FFE1A] p-2 rounded-[8px]"
            stylearr={[12, 15, 700]}
          >
            Category : {name}
          </CustomText>
        </Flex>
        <CloseIcon className="cursor-pointer" onClick={onClose} />
      </Flex>
      <Flex className="flex-col gap-6 w-full">
        <Flex className="flex flex-col w-full gap-4">
          <CustomText stylearr={[18, 27, 600]}>Question</CustomText>
          <CustomInput
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Flex>

        <Flex className="flex flex-col w-full gap-4">
          <CustomText stylearr={[18, 27, 600]}>Answer</CustomText>
          <CustomInput
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Flex>
      </Flex>
      <Flex className="w-full justify-end items-end">
        <CustomButton
          style={{
            background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
          }}
          onClick={() => {
            handleSave();
          }}
          isLoading={isLoading}
          isDisabled={!(question?.trim() && answer?.trim() && id)}
          w={"165px"}
        >
          Save as FAQ
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
