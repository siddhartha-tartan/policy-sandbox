import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { FiBarChart2, FiCode, FiTable } from "react-icons/fi";
import { userStore } from "../../../../../store/userStore";
import { getInitials } from "../../../../../utils/common/getInitials";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import GPTResponseLoading from "../../../../PolyGPT/components/GPTResponseLoading";
import GradientText from "../../../../common/GradientText/GradientText";
import {
  activeTabAtom,
  chatAtom,
  ChatMessage,
  isLoadingAtom,
  ResultTab,
  selectedChatIndexAtom,
} from "../../../utils/atom";

const MotionDiv = motion.div;

function UserQueryBubble({
  query,
  userInitials,
}: {
  query: string;
  userInitials: string;
}) {
  return (
    <MotionDiv
      className="flex flex-row items-center justify-end gap-[10px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="bg-[#F5F5F5] rounded-tl-[18px] rounded-br-[18px] rounded-bl-[18px] py-3 px-[18px] max-w-[85%]">
        <CustomText stylearr={[14, 21, 500]} color="#353535">
          {query}
        </CustomText>
      </div>
      <div className="flex border rounded-full w-10 h-10 border-[#E8EAF6] bg-[#E8EAF6] items-center justify-center flex-shrink-0">
        <GradientText
          text={userInitials}
          gradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
          className="text-base leading-5 font-bold"
        />
      </div>
    </MotionDiv>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ActionButton({ icon, label, isActive, onClick }: ActionButtonProps) {
  return (
    <Flex
      className={`items-center gap-[6px] cursor-pointer transition-all px-3 py-[6px] rounded-full border ${
        isActive
          ? "bg-[#F0F5FF] border-[#3762DD]/30"
          : "bg-white border-[#E4E7EC] hover:border-[#3762DD]/30 hover:bg-[#FAFBFF]"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <span style={{ color: isActive ? "#3762DD" : "#6B7280" }}>{icon}</span>
      <CustomText
        stylearr={[12, 16, 500]}
        color={isActive ? "#3762DD" : "#6B7280"}
      >
        {label}
      </CustomText>
    </Flex>
  );
}

function AIResponseBubble({
  message,
  hasChart,
  activeTab,
  isSelected,
  onTabClick,
}: {
  message: ChatMessage;
  hasChart: boolean;
  activeTab: ResultTab;
  isSelected: boolean;
  onTabClick: (tab: ResultTab) => void;
}) {
  return (
    <MotionDiv
      className="flex flex-row items-start gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F6A623] to-[#F6A623] flex items-center justify-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>
      <div className="flex flex-col gap-[10px] flex-1 min-w-0">
        <div className="bg-white border border-[#E9EAEC] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px] py-3 px-[18px]">
          <CustomText stylearr={[14, 21, 500]} color="#353535">
            {message.message}
          </CustomText>
        </div>

        {isSelected && message.sql_query && (
          <Flex className="flex-wrap gap-2">
            <ActionButton
              icon={<FiCode size={14} />}
              label="SQL Query"
              isActive={activeTab === "sql"}
              onClick={() => onTabClick("sql")}
            />
            <ActionButton
              icon={<FiTable size={14} />}
              label="Result"
              isActive={activeTab === "result"}
              onClick={() => onTabClick("result")}
            />
            {hasChart && (
              <ActionButton
                icon={<FiBarChart2 size={14} />}
                label="Chart"
                isActive={activeTab === "chart"}
                onClick={() => onTabClick("chart")}
              />
            )}
          </Flex>
        )}
      </div>
    </MotionDiv>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
  userInitials: string;
  index: number;
  isSelected: boolean;
  activeTab: ResultTab;
  onSelect: () => void;
  onTabClick: (tab: ResultTab) => void;
}

function ChatBubble({
  message,
  userInitials,
  isSelected,
  activeTab,
  onSelect,
  onTabClick,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex flex-col gap-4 p-2 rounded-lg transition-all cursor-pointer ${
        isSelected
          ? "bg-[#F5F9FF] border border-[#3762DD]/20"
          : "hover:bg-[#FAFAFA]"
      }`}
      onClick={onSelect}
    >
      <UserQueryBubble query={message.query} userInitials={userInitials} />
      <AIResponseBubble
        message={message}
        hasChart={!!message.chart_config}
        activeTab={activeTab}
        isSelected={isSelected}
        onTabClick={onTabClick}
      />
    </div>
  );
}

export default function ChatSection() {
  const chat = useAtomValue(chatAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [selectedChatIndex, setSelectedChatIndex] = useAtom(
    selectedChatIndexAtom
  );
  const { name } = userStore();
  const userInitials = useMemo(() => getInitials(name), [name]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const effectiveSelectedIndex =
    selectedChatIndex !== null ? selectedChatIndex : chat.length - 1;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isLoading]);

  useEffect(() => {
    if (chat.length > 0 && selectedChatIndex === null) {
      setSelectedChatIndex(chat.length - 1);
    }
  }, [chat.length, selectedChatIndex, setSelectedChatIndex]);

  const handleSelectMessage = (index: number) => {
    setSelectedChatIndex(index);
  };

  const handleTabClick = (tab: ResultTab) => {
    setActiveTab(tab);
  };

  return (
    <div
      ref={scrollRef}
      className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2"
      style={{ scrollbarWidth: "thin" }}
    >
      {chat.map((message, index) => (
        <ChatBubble
          key={`chat-${index}-${message.executed_at_ms}`}
          message={message}
          userInitials={userInitials}
          index={index}
          isSelected={index === effectiveSelectedIndex}
          activeTab={activeTab}
          onSelect={() => handleSelectMessage(index)}
          onTabClick={handleTabClick}
        />
      ))}
      {isLoading && <GPTResponseLoading />}
    </div>
  );
}
