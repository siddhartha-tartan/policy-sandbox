import { Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
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
            <div className="flex flex-col gap-4 min-w-[680px] max-w-[680px] mx-auto z-[2]">
              <PromptInput shouldNavigate />
              <SimpleGrid columns={2} gap="8px">
                {suggestedQuerygenPrompts?.map((item) => (
                  <div
                    className="flex flex-row items-center gap-1 py-[10px] px-3 border rounded-[40px]"
                    key={item}
                    style={{
                      background: "#FFFFFF",
                      borderColor: "rgba(217, 209, 203, 0.20)",
                      backdropFilter: "blur(42px)",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      setQuery(item);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M13.7501 18.127C13.7501 18.2928 13.6843 18.4517 13.567 18.5689C13.4498 18.6861 13.2909 18.752 13.1251 18.752H6.8751C6.70934 18.752 6.55037 18.6861 6.43316 18.5689C6.31595 18.4517 6.2501 18.2928 6.2501 18.127C6.2501 17.9612 6.31595 17.8023 6.43316 17.6851C6.55037 17.5678 6.70934 17.502 6.8751 17.502H13.1251C13.2909 17.502 13.4498 17.5678 13.567 17.6851C13.6843 17.8023 13.7501 17.9612 13.7501 18.127ZM16.8751 8.127C16.8778 9.1689 16.6424 10.1977 16.1869 11.1347C15.7315 12.0718 15.0679 12.8925 14.247 13.534C14.0935 13.6517 13.9689 13.8029 13.8828 13.9761C13.7967 14.1493 13.7513 14.3398 13.7501 14.5332V15.002C13.7501 15.3335 13.6184 15.6515 13.384 15.8859C13.1496 16.1203 12.8316 16.252 12.5001 16.252H7.5001C7.16858 16.252 6.85064 16.1203 6.61622 15.8859C6.3818 15.6515 6.2501 15.3335 6.2501 15.002V14.5332C6.24997 14.3421 6.20603 14.1536 6.12166 13.9822C6.03728 13.8107 5.91472 13.6609 5.76338 13.5442C4.94448 12.9064 4.28139 12.0907 3.8243 11.1588C3.36722 10.2269 3.12812 9.20323 3.1251 8.16528C3.10479 4.44184 6.11416 1.34106 9.83448 1.252C10.7512 1.22991 11.663 1.39141 12.5163 1.72701C13.3696 2.06261 14.1472 2.56551 14.8033 3.20613C15.4593 3.84675 15.9806 4.61213 16.3364 5.45722C16.6922 6.30232 16.8754 7.21005 16.8751 8.127ZM15.6251 8.127C15.6253 7.37673 15.4754 6.634 15.1843 5.94253C14.8932 5.25106 14.4666 4.62482 13.9298 4.10068C13.393 3.57653 12.7568 3.16507 12.0585 2.89052C11.3603 2.61596 10.6142 2.48386 9.86417 2.502C6.81729 2.57387 4.3587 5.11059 4.3751 8.15746C4.37796 9.00636 4.57385 9.84349 4.94796 10.6055C5.32206 11.3675 5.86459 12.0345 6.53448 12.5559C6.8356 12.79 7.07918 13.0899 7.24655 13.4326C7.41392 13.7753 7.50065 14.1518 7.5001 14.5332V15.002H12.5001V14.5332C12.501 14.1507 12.5892 13.7735 12.758 13.4303C12.9269 13.087 13.1719 12.7869 13.4743 12.5528C14.1463 12.0276 14.6894 11.3559 15.0621 10.5889C15.4349 9.82186 15.6274 8.9798 15.6251 8.127ZM14.3665 7.39731C14.2044 6.49207 13.7689 5.65822 13.1186 5.00801C12.4682 4.3578 11.6343 3.92246 10.729 3.76059C10.6481 3.74694 10.5652 3.74938 10.4852 3.76775C10.4052 3.78612 10.3296 3.82007 10.2627 3.86766C10.1958 3.91525 10.139 3.97555 10.0954 4.04511C10.0518 4.11467 10.0223 4.19214 10.0087 4.27309C9.99505 4.35404 9.99748 4.43688 10.0159 4.51689C10.0342 4.59689 10.0682 4.6725 10.1158 4.73939C10.1634 4.80628 10.2237 4.86313 10.2932 4.90672C10.3628 4.9503 10.4402 4.97976 10.5212 4.9934C11.8157 5.21137 12.9142 6.30981 13.1337 7.60668C13.1584 7.75225 13.2339 7.88436 13.3467 7.97959C13.4595 8.07483 13.6025 8.12705 13.7501 8.127C13.7854 8.12678 13.8207 8.12391 13.8556 8.1184C14.0189 8.09051 14.1645 7.99888 14.2604 7.86365C14.3562 7.72843 14.3944 7.56068 14.3665 7.39731Z"
                        fill="#555557"
                      />
                    </svg>
                    <CustomText stylearr={[12, 16, 500]} color="#555557">
                      {item}
                    </CustomText>
                  </div>
                ))}
              </SimpleGrid>
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
