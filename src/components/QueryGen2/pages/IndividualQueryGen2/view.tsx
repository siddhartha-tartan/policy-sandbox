import { Flex, Tooltip } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import useGetUserType from "../../../../hooks/useGetUserType";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
} from "../../../../utils/constants/constants";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import PromptInput from "../../components/PromptInput";
import { chatAtom } from "../../utils/atom";
import ChatSection from "./components/ChatSection";
import ResultSection from "./components/ResultSection";

export default function IndividualQueryGen2() {
  const chat = useAtomValue(chatAtom);
  const setChat = useSetAtom(chatAtom);
  const navigate = useNavigate();
  const userType = useGetUserType();

  useEffect(() => {
    if (!chat || chat?.length === 0) {
      navigate(`${BASE_ROUTES[userType]}/${BASE_MODULE_ROUTE.QUERYGEN_2}`);
    }
  }, [chat.length, navigate, userType]);

  if (chat.length === 0) {
    return null;
  }

  const handleNewQuery = () => {
    setChat([]);
    navigate(`${BASE_ROUTES[userType]}/${BASE_MODULE_ROUTE.QUERYGEN_2}`);
  };

  return (
    <Flex className="w-full h-full flex-row gap-4 p-4 bg-[#FAFAFA]">
      {/* Left Panel - Chat Section */}
      <Flex
        className="flex-col h-full bg-white rounded-lg border border-[#E9EAEC] overflow-hidden"
        width="40%"
        minWidth="380px"
      >
        {/* Chat Header */}
        <Flex className="h-[52px] px-4 items-center justify-between border-b border-[#E9EAEC] flex-shrink-0">
          <CustomText stylearr={[14, 20, 600]} color="#111827">
            Conversation
          </CustomText>
          <Tooltip label="New Query" placement="bottom" hasArrow>
            <Flex
              onClick={handleNewQuery}
              className="p-2 cursor-pointer rounded-md hover:bg-[#F3F4F6] transition-all duration-200 items-center justify-center"
            >
              <FiEdit size={16} color="#6B7280" />
            </Flex>
          </Tooltip>
        </Flex>

        {/* Chat Messages */}
        <Flex className="flex-1 flex-col p-4 overflow-hidden">
          <ChatSection />
        </Flex>

        {/* Input Box at Bottom */}
        <Flex className="p-4 border-t border-[#E9EAEC]">
          <PromptInput />
        </Flex>
      </Flex>

      {/* Right Panel - Result Section */}
      <Flex className="flex-col h-full flex-1 overflow-hidden">
        <ResultSection />
      </Flex>
    </Flex>
  );
}
