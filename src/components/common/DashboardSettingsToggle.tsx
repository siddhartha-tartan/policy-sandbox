import { Flex, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { LayoutFive } from "react-huge-icons/outline";
import { useLocation } from "react-router-dom";
import {
  dashboardSettingsAtom,
  needsAttentionAtom,
  pendingQueriesAtom,
  recentAssessmentAtom,
  recentAttesstaionsAtom,
} from "../../store/dashboardSettingsAtom";
import { userStore } from "../../store/userStore";
import { DashboardFeaturesEnum } from "../../utils/constants/constants";
import { serializeJson } from "../../utils/helpers/serializeJson";
import { customColors } from "../DesignSystem/Colors/CustomColors";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomButton from "../DesignSystem/CustomButton";
import useUpdateUser from "./UserManagement/hooks/useUpdateUser";

const DashboardSettingsToggle = () => {
  const location = useLocation();
  const isSpocDashboard = location?.pathname?.includes("spoc/home");
  const [isDashboardSettingView, setIsDashboardSettingView] = useAtom(
    dashboardSettingsAtom
  );
  const { mutate: updateDashboardConfig, isLoading } = useUpdateUser();
  const [recentAttesstationState, setRecentAttesstationState] = useAtom(
    recentAttesstaionsAtom
  );
  const [recentAssessmentState, setRecentAssessmentState] =
    useAtom(recentAssessmentAtom);
  const [needsAttentionState, setNeedsAttentionState] =
    useAtom(needsAttentionAtom);
  const [pendingQueriesState, setPendingQueriesState] =
    useAtom(pendingQueriesAtom);
  const { id, dashboardFeatures } = userStore();

  useEffect(() => {
    setIsDashboardSettingView(false);
    setRecentAttesstationState(
      dashboardFeatures?.includes(DashboardFeaturesEnum.RECENT_ATTESTATIONS) ??
        false
    );
    setNeedsAttentionState(
      dashboardFeatures?.includes(DashboardFeaturesEnum.NEEDS_ATTENTION) ??
        false
    );
    setPendingQueriesState(
      dashboardFeatures?.includes(DashboardFeaturesEnum.PENDING_QUERIES) ??
        false
    );
    setRecentAssessmentState(
      dashboardFeatures?.includes(DashboardFeaturesEnum.RECENT_ASSESSMENT) ??
        false
    );
  }, [location]);

  const updateView = () => {
    const metadata = [
      {
        name: DashboardFeaturesEnum.NEEDS_ATTENTION,
        is_enable: needsAttentionState,
      },
      {
        name: DashboardFeaturesEnum.PENDING_QUERIES,
        is_enable: pendingQueriesState,
      },
      {
        name: DashboardFeaturesEnum.RECENT_ASSESSMENT,
        is_enable: recentAssessmentState,
      },
      {
        name: DashboardFeaturesEnum.RECENT_ATTESTATIONS,
        is_enable: recentAttesstationState,
      },
    ];
    updateDashboardConfig(
      //@ts-ignore
      {
        id: id,
        _metadata: serializeJson({
          feature_list: metadata,
        }),
      },
      {
        onSuccess() {
          setIsDashboardSettingView(false);
        },
      }
    );
  };
  return isSpocDashboard ? (
    <>
      {isDashboardSettingView && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <CustomButton
            className="text-sm leading-4 font-semibold h-[38px]"
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={updateView}
          >
            Save View
          </CustomButton>
        </motion.div>
      )}
      <motion.div
        whileHover={{
          scale: 1.05, // Slightly increase the size on hover
        }}
        className="flex rounded-3xl items-center justify-center cursor-pointer w-9 h-9"
        style={{
          backgroundColor: isDashboardSettingView
            ? systemColors.indigo[500]
            : "#E3E9FA",
        }}
        onClick={() => setIsDashboardSettingView((prev) => !prev)}
        whileTap={{ scale: 0.95 }} // Slightly shrink on tap/click
        transition={{ type: "spring", stiffness: 200, damping: 10 }} // Smooth animation
      >
        <Icon
          as={LayoutFive}
          color={isDashboardSettingView ? "#FFF" : customColors.ONYX}
          fontSize={"20px"}
        />
      </motion.div>
    </>
  ) : (
    <Flex />
  );
};

export default DashboardSettingsToggle;
