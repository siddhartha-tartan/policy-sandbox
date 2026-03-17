import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useMemo } from "react";
import {
  Assignment,
  ChatWritten,
  DocumentText,
  FileWrittenBent,
  Interactive,
  UsersTriple,
} from "react-huge-icons/outline";
import { systemColors } from "../../../components/DesignSystem/Colors/SystemColors";
import {
  needsAttentionAtom,
  pendingQueriesAtom,
  recentAssessmentAtom,
  recentAttesstaionsAtom,
} from "../../../store/dashboardSettingsAtom";
import { userStore } from "../../../store/userStore";
import { DashboardFeaturesEnum } from "../../../utils/constants/constants";
import ActionableItems from "./components/ActionableItems";
import DashboardWidgets from "./components/DashboardWidgets";
import NeedsAttention from "./components/NeedsAttention";
import PendingQueries from "./components/PendingQueries";
import ProductCategoryFilter from "./components/ProductCategoryFilter";
import RecentAssessments from "./components/RecentAssessments";
import RecentAttestations from "./components/RecentAttestations";
import Reminders from "./components/Reminders";
import Stats from "./components/Stats";
import useGetAnalytics from "./hooks/useGetAnalytics";

const Home = () => {
  const {
    data,
    setPolicyCategoryId,
    setUserCategoryId,
    userCategoryId,
    policyCategoryId,
  } = useGetAnalytics();
  const { dashboardFeatures } = userStore();
  const [recentAttesstationState, setRecentAttesstationState] = useAtom(
    recentAttesstaionsAtom
  );
  const [recentAssessmentState, setRecentAssessmentState] =
    useAtom(recentAssessmentAtom);
  const [needsAttentionState, setNeedsAttentionState] =
    useAtom(needsAttentionAtom);
  const [pendingQueriesState, setPendingQueriesState] =
    useAtom(pendingQueriesAtom);
  const recentAssessmentsData = data?.spoc_data?.recent_assessment || [];
  const pendingQueriesData = data?.spoc_data?.pending_queries || [];
  const expiredPolicies = data?.spoc_data?.expired_policies || [];

  const statsConfig = [
    {
      icon: UsersTriple,
      title: "Active Users",
      value: data?.spoc_data?.active_users || 0,
      filterComp: (
        <ProductCategoryFilter
          value={userCategoryId}
          onChange={(e) => setUserCategoryId(e)}
        />
      ),
    },
    {
      icon: DocumentText,
      title: "Active Policies",
      value: data?.spoc_data?.active_policy || 0,
      filterComp: (
        <ProductCategoryFilter
          value={policyCategoryId}
          onChange={(e) => setPolicyCategoryId(e)}
        />
      ),
    },
    {
      icon: DocumentText,
      title: "Assessment Score",
      value: `${data?.spoc_data?.passing_percentage?.toFixed(2) || 0}%`,
      filterComp: null,
    },
  ];

  const widgetsConfig = useMemo(
    () => [
      {
        icon: Assignment,
        key: DashboardFeaturesEnum.RECENT_ATTESTATIONS,
        title: "Recent Attestations",
        navigateTo: "",
        bodyComp: <RecentAttestations key={"attestaion-body"} />,
        isEnabled: dashboardFeatures?.includes(
          DashboardFeaturesEnum.RECENT_ATTESTATIONS
        ),
        state: recentAttesstationState,
        onChange: () => setRecentAttesstationState((prev) => !prev),
      },

      {
        icon: FileWrittenBent,
        key: DashboardFeaturesEnum.PENDING_QUERIES,
        title: "Pending Queries",
        navigateTo: "",
        // navigateTo: `${BASE_ROUTES.SPOC}/query`,
        bodyComp: (
          <PendingQueries key={"query-body"} data={pendingQueriesData} />
        ),
        isEnabled: dashboardFeatures?.includes(
          DashboardFeaturesEnum.PENDING_QUERIES
        ),
        state: pendingQueriesState,
        onChange: () => setPendingQueriesState((prev) => !prev),
      },
      {
        icon: Interactive,
        key: DashboardFeaturesEnum.NEEDS_ATTENTION,
        title: "Needs Attention",
        navigateTo: "",
        bodyComp: (
          <NeedsAttention key={"attention-body"} data={expiredPolicies} />
        ),
        isEnabled: dashboardFeatures?.includes(
          DashboardFeaturesEnum.NEEDS_ATTENTION
        ),
        state: needsAttentionState,
        onChange: () => setNeedsAttentionState((prev) => !prev),
      },
      {
        icon: ChatWritten,
        key: DashboardFeaturesEnum.RECENT_ASSESSMENT,
        title: "Recent Assessment",
        navigateTo: "",
        // navigateTo: `${BASE_ROUTES.SPOC}/assessment`,
        bodyComp: (
          <RecentAssessments
            key="assessment-body"
            data={recentAssessmentsData}
          />
        ),
        isEnabled: dashboardFeatures?.includes(
          DashboardFeaturesEnum.RECENT_ASSESSMENT
        ),
        state: recentAssessmentState,
        onChange: () => setRecentAssessmentState((prev) => !prev),
      },
    ],
    [
      pendingQueriesData,
      recentAssessmentsData,
      recentAttesstationState,
      dashboardFeatures,
      pendingQueriesState,
      needsAttentionState,
      expiredPolicies,
      recentAssessmentState,
    ]
  );
  const reminders = useMemo(
    () => data?.spoc_data?.assessment_reminder || [],
    [data?.spoc_data?.assessment_reminder?.length]
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0.1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.1,
        delay: 0.1,
      }}
      className="flex w-full gap-4"
    >
      <Flex
        className="flex-col gap-3 w-full h-full p-4 overflow-y-auto"
        bg={systemColors.black[50]}
      >
        <ActionableItems />
        <Flex className="flex-row gap-3">
          <Flex className="flex-col gap-3 grow">
            <Stats config={statsConfig} />
            <DashboardWidgets
              config={widgetsConfig}
              key={widgetsConfig?.length}
            />
          </Flex>
          <Reminders data={reminders} />
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Home;
