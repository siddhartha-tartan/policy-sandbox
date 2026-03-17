import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { FiBarChart2 } from "react-icons/fi";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import {
  activeTabAtom,
  chatAtom,
  ResultTab,
  selectedChatIndexAtom,
} from "../../../utils/atom";
import ChartTab from "./ChartTab";
import GeneratedSQLTab from "./GeneratedSQLTab";
import ResultTableTab from "./ResultTableTab";

interface TabConfig {
  id: ResultTab;
  label: string;
  icon?: React.ReactNode;
}

const BASE_TABS: TabConfig[] = [
  { id: "sql", label: "Generated SQL" },
  { id: "result", label: "Result" },
];

interface FullScreenResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullScreenResultModal({
  isOpen,
  onClose,
}: FullScreenResultModalProps) {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const chat = useAtomValue(chatAtom);
  const selectedChatIndex = useAtomValue(selectedChatIndexAtom);
  const effectiveIndex =
    selectedChatIndex !== null ? selectedChatIndex : chat.length - 1;
  const selectedMessage = chat[effectiveIndex];
  const hasChart = !!selectedMessage?.chart_config;

  const tabs: TabConfig[] = hasChart
    ? [...BASE_TABS, { id: "chart", label: "Chart", icon: <FiBarChart2 size={14} /> }]
    : BASE_TABS;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent
        m={4}
        borderRadius="lg"
        h="calc(100vh - 32px)"
        maxW="calc(100vw - 32px)"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <ModalCloseButton
          zIndex={10}
          top={4}
          right={4}
          bg="white"
          borderRadius="full"
          _hover={{ bg: "#F3F4F6" }}
        />
        <ModalBody p={0} display="flex" flexDirection="column" flex={1} overflow="hidden">
          <Flex className="border-b border-[#E4E7EC] flex-shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Flex
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 cursor-pointer transition-all duration-200 items-center gap-2 ${
                    isActive
                      ? "border-b-2 border-[#3762DD] bg-[#F5F9FF]"
                      : "hover:bg-[#F9FAFB]"
                  }`}
                >
                  {tab.icon && (
                    <span
                      style={{ color: isActive ? "#3762DD" : "#6B7280" }}
                    >
                      {tab.icon}
                    </span>
                  )}
                  <CustomText
                    stylearr={[14, 20, 600]}
                    color={isActive ? "#3762DD" : "#6B7280"}
                  >
                    {tab.label}
                  </CustomText>
                </Flex>
              );
            })}
          </Flex>

          <Flex flex={1} w="full" overflow="hidden">
            {activeTab === "sql" && <GeneratedSQLTab />}
            {activeTab === "result" && <ResultTableTab />}
            {activeTab === "chart" && <ChartTab />}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
