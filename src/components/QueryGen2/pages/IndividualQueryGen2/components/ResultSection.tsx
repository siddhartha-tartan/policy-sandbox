import { Flex, Tooltip } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useDisclosure } from "@chakra-ui/react";
import { FiBarChart2, FiMaximize2 } from "react-icons/fi";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import {
  activeTabAtom,
  chatAtom,
  ResultTab,
  selectedChatIndexAtom,
} from "../../../utils/atom";
import ChartTab from "./ChartTab";
import FullScreenResultModal from "./FullScreenResultModal";
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

export default function ResultSection() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chat = useAtomValue(chatAtom);
  const selectedChatIndex = useAtomValue(selectedChatIndexAtom);
  const effectiveIndex =
    selectedChatIndex !== null ? selectedChatIndex : chat.length - 1;
  const selectedMessage = chat[effectiveIndex];
  const hasChart = !!selectedMessage?.chart_config;

  const tabs: TabConfig[] = hasChart
    ? [
        ...BASE_TABS,
        {
          id: "chart",
          label: "Chart",
          icon: <FiBarChart2 size={14} />,
        },
      ]
    : BASE_TABS;

  return (
    <>
      <Flex className="flex-col h-full bg-white rounded-lg border border-[#E9EAEC] overflow-hidden">
        <Flex className="border-b border-[#E4E7EC] justify-between items-center">
          <Flex>
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
                    <span style={{ color: isActive ? "#3762DD" : "#6B7280" }}>
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
          <Tooltip label="Expand" placement="top" hasArrow>
            <Flex
              onClick={onOpen}
              className="p-2 mr-2 cursor-pointer rounded-md hover:bg-[#F3F4F6] transition-all duration-200 items-center justify-center"
            >
              <FiMaximize2 size={16} color="#6B7280" />
            </Flex>
          </Tooltip>
        </Flex>

        <Flex className="flex-1 w-full overflow-hidden">
          {activeTab === "sql" && <GeneratedSQLTab />}
          {activeTab === "result" && <ResultTableTab />}
          {activeTab === "chart" && <ChartTab />}
        </Flex>
      </Flex>

      <FullScreenResultModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

