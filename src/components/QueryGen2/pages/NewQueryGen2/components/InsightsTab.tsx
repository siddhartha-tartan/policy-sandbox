import {
  Box,
  Collapse,
  Flex,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiCode,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiDollarSign,
  FiX,
  FiZap,
} from "react-icons/fi";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import {
  generateNudges,
  Nudge,
  NudgeCategory,
  NudgePriority,
} from "../../../utils/nudgeEngine";

const MotionFlex = motion(Flex);

const PRIORITY_CONFIG: Record<
  NudgePriority,
  { color: string; bg: string; label: string }
> = {
  high: { color: "#DC2626", bg: "#FEF2F2", label: "High" },
  medium: { color: "#D97706", bg: "#FFFBEB", label: "Medium" },
  low: { color: "#2563EB", bg: "#EFF6FF", label: "Low" },
};

const CATEGORY_CONFIG: Record<
  NudgeCategory,
  { icon: React.ElementType; label: string; color: string }
> = {
  risk: { icon: FiShield, label: "Risk", color: "#7C3AED" },
  collections: { icon: FiDollarSign, label: "Collections", color: "#059669" },
  operations: { icon: FiTarget, label: "Operations", color: "#0284C7" },
  growth: { icon: FiTrendingUp, label: "Growth", color: "#D97706" },
};

/* ── Individual Insight Card ── */

function InsightCard({
  nudge,
  isInvestigating,
  onInvestigate,
  onDismiss,
}: {
  nudge: Nudge;
  isInvestigating: boolean;
  onInvestigate: () => void;
  onDismiss: () => void;
}) {
  const { isOpen: isSqlOpen, onToggle: toggleSql } = useDisclosure();
  const priority = PRIORITY_CONFIG[nudge.priority];
  const category = CATEGORY_CONFIG[nudge.category];
  const CategoryIcon = category.icon;

  return (
    <MotionFlex
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      className="flex-col rounded-xl group"
      bg="white"
      border="1px solid"
      borderColor={isInvestigating ? "#3762DD" : "#E4E7EC"}
      _hover={isInvestigating ? {} : { borderColor: "#D1D5DB", shadow: "sm" }}
      transition="all 0.2s"
      position="relative"
    >
      {/* Investigating overlay */}
      <AnimatePresence>
        {isInvestigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(2px)",
              borderRadius: "12px",
            }}
          >
            <Flex className="flex-col items-center gap-3">
              <Flex className="items-center gap-3">
                <Spinner
                  size="sm"
                  color="#3762DD"
                  thickness="2.5px"
                  speed="0.8s"
                />
                <CustomText stylearr={[14, 20, 600]} color="#3762DD">
                  Analyzing data...
                </CustomText>
              </Flex>
              <Flex className="items-center gap-1.5 overflow-hidden" maxW="320px">
                <Box
                  h="3px"
                  borderRadius="full"
                  bg="#E4E7EC"
                  w="full"
                  overflow="hidden"
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.5, ease: "easeInOut" }}
                    style={{
                      height: "100%",
                      borderRadius: "9999px",
                      background:
                        "linear-gradient(90deg, #3762DD, #6B8AFF)",
                    }}
                  />
                </Box>
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card body */}
      <Flex className="flex-col gap-3 p-5">
        {/* Row 1: priority + category + metric + dismiss */}
        <Flex className="items-center gap-2">
          <Flex
            className="items-center gap-1.5 rounded-full px-2.5 py-0.5"
            bg={priority.bg}
          >
            <Box w="6px" h="6px" borderRadius="full" bg={priority.color} />
            <CustomText stylearr={[11, 14, 600]} color={priority.color}>
              {priority.label}
            </CustomText>
          </Flex>
          <Flex className="items-center gap-1 rounded-full px-2 py-0.5 bg-[#F3F4F6]">
            <CategoryIcon size={10} color={category.color} />
            <CustomText stylearr={[11, 14, 500]} color="#6B7280">
              {category.label}
            </CustomText>
          </Flex>
          <Box flex={1} />
          {nudge.metric && (
            <CustomText stylearr={[18, 24, 700]} color={priority.color}>
              {nudge.metric}
            </CustomText>
          )}
          <Tooltip label="Dismiss" placement="top" hasArrow>
            <Flex
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1.5 cursor-pointer rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#F3F4F6]"
            >
              <FiX size={14} color="#9CA3AF" />
            </Flex>
          </Tooltip>
        </Flex>

        {/* Row 2: title */}
        <CustomText stylearr={[15, 22, 600]} color="#111827">
          {nudge.title}
        </CustomText>

        {/* Row 3: description */}
        <CustomText stylearr={[13, 20, 400]} color="#4B5563">
          {nudge.description}
        </CustomText>

        {/* Row 4: SQL toggle + investigate */}
        <Flex className="items-center justify-between pt-1">
          <Flex
            onClick={toggleSql}
            className="items-center gap-1.5 cursor-pointer rounded-md px-2 py-1 hover:bg-[#F3F4F6] transition-colors"
          >
            <FiCode size={13} color="#6B7280" />
            <CustomText stylearr={[12, 16, 500]} color="#6B7280">
              SQL Query
            </CustomText>
            {isSqlOpen ? (
              <FiChevronDown size={13} color="#6B7280" />
            ) : (
              <FiChevronRight size={13} color="#6B7280" />
            )}
          </Flex>
          <Flex
            onClick={isInvestigating ? undefined : onInvestigate}
            className="items-center gap-1.5 cursor-pointer rounded-lg px-3 py-1.5 transition-colors"
            bg={isInvestigating ? "#93A8E8" : "#3762DD"}
            _hover={isInvestigating ? {} : { bg: "#2B50B8" }}
            pointerEvents={isInvestigating ? "none" : "auto"}
          >
            <FiZap size={13} color="white" />
            <CustomText stylearr={[12, 16, 600]} color="white">
              Investigate
            </CustomText>
          </Flex>
        </Flex>
      </Flex>

      {/* SQL Block (collapsible) */}
      <Collapse in={isSqlOpen} animateOpacity>
        <Flex className="px-5 pb-4">
          <Box
            w="full"
            bg="#1E1E2E"
            borderRadius="lg"
            px={4}
            py={3}
            maxH="240px"
            overflowX="auto"
            overflowY="auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <CustomText
              stylearr={[12, 18, 400]}
              color="#A6E3A1"
              fontFamily="'SF Mono', 'Fira Code', 'Consolas', monospace"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
            >
              {nudge.sql_query}
            </CustomText>
          </Box>
        </Flex>
      </Collapse>
    </MotionFlex>
  );
}

/* ── Insights Tab ── */

interface InsightsTabProps {
  onInvestigate: (query: string) => void;
}

export default function InsightsTab({ onInvestigate }: InsightsTabProps) {
  const allNudges = useMemo(() => generateNudges(), []);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [investigatingId, setInvestigatingId] = useState<string | null>(null);

  const visibleNudges = useMemo(
    () => allNudges.filter((n) => !dismissed.has(n.id)),
    [allNudges, dismissed]
  );

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  }, []);

  const handleInvestigate = useCallback(
    (nudge: Nudge) => {
      setInvestigatingId(nudge.id);
      onInvestigate(nudge.query);
    },
    [onInvestigate]
  );

  const highCount = visibleNudges.filter((n) => n.priority === "high").length;
  const mediumCount = visibleNudges.filter(
    (n) => n.priority === "medium"
  ).length;
  const lowCount = visibleNudges.filter((n) => n.priority === "low").length;

  return (
    <Flex className="flex-1 flex-col h-full overflow-hidden bg-[#FAFAFA]">
      {/* Cards area */}
      <Flex
        className="flex-1 flex-col gap-4 p-6 overflow-y-auto"
        maxW="860px"
        mx="auto"
        w="full"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Summary header (above cards, not a bar) */}
        <Flex className="flex-col gap-2 pb-2">
          <Flex className="items-center gap-3">
            <CustomText stylearr={[22, 28, 700]} color="#111827">
              {visibleNudges.length} Insights
            </CustomText>
            <CustomText stylearr={[14, 20, 400]} color="#9CA3AF">
              proactively identified from your data
            </CustomText>
          </Flex>
          <Flex className="items-center gap-3">
            {highCount > 0 && (
              <Flex
                className="items-center gap-1.5 rounded-full px-3 py-1"
                bg="#FEF2F2"
                border="1px solid"
                borderColor="#FECACA"
              >
                <Box w="7px" h="7px" borderRadius="full" bg="#DC2626" />
                <CustomText stylearr={[12, 16, 600]} color="#DC2626">
                  {highCount} High Priority
                </CustomText>
              </Flex>
            )}
            {mediumCount > 0 && (
              <Flex
                className="items-center gap-1.5 rounded-full px-3 py-1"
                bg="#FFFBEB"
                border="1px solid"
                borderColor="#FDE68A"
              >
                <Box w="7px" h="7px" borderRadius="full" bg="#D97706" />
                <CustomText stylearr={[12, 16, 600]} color="#D97706">
                  {mediumCount} Medium Priority
                </CustomText>
              </Flex>
            )}
            {lowCount > 0 && (
              <Flex
                className="items-center gap-1.5 rounded-full px-3 py-1"
                bg="#EFF6FF"
                border="1px solid"
                borderColor="#BFDBFE"
              >
                <Box w="7px" h="7px" borderRadius="full" bg="#2563EB" />
                <CustomText stylearr={[12, 16, 600]} color="#2563EB">
                  {lowCount} Low Priority
                </CustomText>
              </Flex>
            )}
          </Flex>
        </Flex>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {visibleNudges.map((nudge) => (
            <InsightCard
              key={nudge.id}
              nudge={nudge}
              isInvestigating={investigatingId === nudge.id}
              onInvestigate={() => handleInvestigate(nudge)}
              onDismiss={() => handleDismiss(nudge.id)}
            />
          ))}
        </AnimatePresence>

        {visibleNudges.length === 0 && (
          <Flex className="flex-1 items-center justify-center flex-col gap-2 py-20">
            <CustomText stylearr={[16, 22, 600]} color="#111827">
              All clear
            </CustomText>
            <CustomText stylearr={[14, 20, 400]} color="#9CA3AF">
              No pending insights — everything looks healthy
            </CustomText>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
