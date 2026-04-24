import { Flex, useDisclosure } from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { FiMessageSquare, FiZap } from "react-icons/fi";
import blueEllipsis from "../../../../assets/Images/LightBlueEllipsis.png";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import DatabaseSelector from "../../components/DatabaseSelector";
import SchemaPreviewModal from "../../components/SchemaPreview";
import PromptInput from "../../components/PromptInput";
import useGenerateQueryResponse from "../../hooks/useGenerateQueryResponse";
import useGetDbSources from "../../hooks/useGetDbSources";
import { generateNudges } from "../../utils/nudgeEngine";
import {
  chatAtom,
  isLoadingAtom,
  queryAtom,
  selectedChatIndexAtom,
  selectedDbSourceAtom,
} from "../../utils/atom";
import { suggestedQuerygenPrompts } from "./utils/config";
import InsightsTab from "./components/InsightsTab";

type HomeTab = "query" | "insights";

export default function NewQueryGen2() {
  const setQuery = useSetAtom(queryAtom);
  const setChat = useSetAtom(chatAtom);
  const setSelectedChatIndex = useSetAtom(selectedChatIndexAtom);
  const [selectedDbSource, setSelectedDbSource] = useAtom(selectedDbSourceAtom);
  const { data: dbSources, isLoading: isLoadingDbSources } = useGetDbSources();
  const isLoading = useAtomValue(isLoadingAtom);
  const [activeTab, setActiveTab] = useState<HomeTab>("query");
  const {
    isOpen: isSchemaOpen,
    onOpen: onSchemaOpen,
    onClose: onSchemaClose,
  } = useDisclosure();

  const { mutate: generateQueryResponse, buildQueryHistory } =
    useGenerateQueryResponse(true);

  const nudges = useMemo(() => generateNudges(), []);
  const highCount = nudges.filter((n) => n.priority === "high").length;
  const mediumCount = nudges.filter((n) => n.priority === "medium").length;
  const insightCount = highCount + mediumCount;

  useEffect(() => {
    setChat([]);
    setSelectedChatIndex(null);
  }, [setChat, setSelectedChatIndex]);

  useEffect(() => {
    if (dbSources?.length && !selectedDbSource) {
      setSelectedDbSource(dbSources[0].value);
    }
  }, [dbSources, selectedDbSource, setSelectedDbSource]);

  const selectedSource = dbSources?.find((s) => s.value === selectedDbSource);

  const handlePreviewDatabase = (dbValue: string) => {
    setSelectedDbSource(dbValue);
    onSchemaOpen();
  };

  const handleInvestigate = (query: string) => {
    generateQueryResponse({
      user_query: query,
      data_source: selectedDbSource,
      query_history: buildQueryHistory(),
    });
  };

  const TABS: { id: HomeTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "query", label: "Chat", icon: FiMessageSquare },
    { id: "insights", label: "AI Insights", icon: FiZap, badge: insightCount || undefined },
  ];

  return (
    <Flex className="w-full h-full flex-col overflow-hidden">
      {/* Top bar: tabs on left, DB selector on right */}
      <Flex
        className="items-center justify-between px-4 flex-shrink-0"
        h="52px"
      >
        {/* Tabs */}
        <Flex className="items-center h-full gap-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <Flex
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`items-center gap-2 px-4 h-full cursor-pointer transition-colors relative ${
                  isActive ? "" : "hover:bg-[#F9FAFB]"
                }`}
              >
                <TabIcon
                  size={15}
                  color={isActive ? "#3762DD" : "#6B7280"}
                />
                <CustomText
                  stylearr={[13, 18, isActive ? 600 : 500]}
                  color={isActive ? "#3762DD" : "#6B7280"}
                >
                  {tab.label}
                </CustomText>
                {tab.badge != null && tab.badge > 0 && (
                  <Flex
                    className="items-center justify-center rounded-full"
                    bg={isActive ? "#3762DD" : "#DC2626"}
                    minW="18px"
                    h="18px"
                    px="5px"
                  >
                    <CustomText stylearr={[10, 12, 700]} color="white">
                      {tab.badge}
                    </CustomText>
                  </Flex>
                )}
                {/* Active indicator */}
                {isActive && (
                  <Flex
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="2px"
                    bg="#3762DD"
                    borderTopRadius="full"
                  />
                )}
              </Flex>
            );
          })}
        </Flex>

        {/* DB Selector */}
        <Flex className="items-center gap-2">
          <CustomText stylearr={[12, 16, 500]} color="#9CA3AF">
            Database
          </CustomText>
          <DatabaseSelector
            dbSources={dbSources}
            isLoading={isLoadingDbSources}
            selectedDbSource={selectedDbSource}
            onSelectDatabase={setSelectedDbSource}
            onPreviewDatabase={handlePreviewDatabase}
          />
        </Flex>
      </Flex>

      {/* Tab Content */}
      {activeTab === "query" && (
        <Flex className="flex-1 flex-col relative bg-[#FAFAFA] overflow-hidden">
          {/* Blue Ellipsis Decoration */}
          <div
            className="absolute bottom-0 right-0 w-[800px] h-[600px] z-[1]"
            style={{
              backgroundImage: `url(${blueEllipsis})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "50%",
              opacity: 0.8,
              transform: "translate(30%, 30%)",
            }}
          />

          {/* Center Content */}
          <Flex className="flex-1 flex-col gap-[48px] items-center justify-center">
            <div className="flex flex-col gap-3 text-center">
              <CustomText stylearr={[36, 36, 600]} color="#141414">
                Turn your questions into instant insights
              </CustomText>
              <CustomText stylearr={[18, 22, 400]} color="#555557">
                QueryGen writes the SQL, runs it, and visualizes the results
                beautifully
              </CustomText>
            </div>
            <div className="flex flex-col gap-2.5 min-w-[680px] max-w-[680px] mx-auto z-[2]">
              <PromptInput shouldNavigate />
              <div
                className="flex flex-col overflow-hidden rounded-[12px] border"
                style={{
                  background: "rgba(255, 255, 255, 0.92)",
                  borderColor: "rgba(228, 231, 236, 0.9)",
                  backdropFilter: "blur(24px)",
                }}
              >
                {suggestedQuerygenPrompts?.map((item, index) => (
                  <div
                    className={`flex flex-row items-start gap-2 px-3 py-2 transition-colors ${
                      isLoading ? "" : "hover:bg-[#F9FAFB]"
                    }`}
                    key={item}
                    style={{
                      cursor: isLoading ? "not-allowed" : "pointer",
                      borderBottom:
                        index === suggestedQuerygenPrompts.length - 1
                          ? "none"
                          : "1px solid rgba(228, 231, 236, 0.8)",
                    }}
                    onClick={() => {
                      setQuery(item);
                    }}
                  >
                    <div className="w-[4px] h-[4px] rounded-full bg-[#9CA3AF] mt-[7px] flex-shrink-0" />
                    <CustomText stylearr={[11, 14, 500]} color="#555557">
                      {item}
                    </CustomText>
                  </div>
                ))}
              </div>
            </div>
          </Flex>
        </Flex>
      )}

      {activeTab === "insights" && (
        <InsightsTab onInvestigate={handleInvestigate} />
      )}

      {/* Schema Preview Modal */}
      <SchemaPreviewModal
        isOpen={isSchemaOpen}
        onClose={onSchemaClose}
        dbLabel={selectedSource?.label || "Database"}
        onSelect={() => {}}
      />
    </Flex>
  );
}
