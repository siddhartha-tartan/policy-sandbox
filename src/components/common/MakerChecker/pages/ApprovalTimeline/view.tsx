import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiMinus, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { userStore } from "../../../../../store/userStore";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { getLoanCategoryTypeById } from "../../../../../utils/helpers/loanCategoryHelpers";
import { MOCK_POLICIES } from "../../../../../mock/mockData";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import HeaderBackCta from "../../../HeaderBackCta";
import PageLayout from "../../../PageLayout";
import DocViewer from "../../../DocViewer";
import useGetFile from "../../../Policy/hooks/useGetFile";
import { VersionHistoryItem } from "../../../Policy/hooks/useGetPolicyDetails";
import VersionDropdown from "../../../ComparePolicy/components/VersionDropdown";
import { MAKER_CHECKER_SUB_ROUTES } from "../../utils/constant";
import useGetApprovalTimeline from "./hooks/useGetApprovalTimeline";
import { adaptTimelineResp } from "./utils/helpers";
import VerticalTimeline from "./components/VerticalTimeline";

const PriorityBadge: Record<string, { color: string; background: string }> = {
  HIGH: { color: "#E64A19", background: "#FFD8D4" },
  MEDIUM: { color: "#F9A825", background: "#FFF9C7" },
  LOW: { color: "#0CAF60", background: "#E7F7EF" },
};

const CHANGE_TYPE_LABELS: Record<string, string> = {
  new_upload: "New Policy",
  version_upload: "Version Upload",
  inline_edit: "Inline Edit",
};

const ApprovalTimeline = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGetApprovalTimeline(id);
  const { mutate, isLoading: isFileLoading, data: fileData } = useGetFile();
  const userType = useGetUserType();
  const { loanCategories } = userStore();

  const [selectedVersionId, setSelectedVersionId] = useState("");

  const policyVersions: VersionHistoryItem[] = useMemo(() => {
    if (!data?.entity_data?.policy_id) return [];
    const mockPolicy = MOCK_POLICIES.find(
      (p) => p.id === data.entity_data.policy_id
    );
    if (!mockPolicy) return [];
    return mockPolicy.versions.map((v, idx) => ({
      name: mockPolicy.file_name,
      owner: mockPolicy.created_by,
      updated_at: new Date(v.created_at).getTime(),
      modified_by: mockPolicy.created_by,
      size: "1 mb",
      version: `V${mockPolicy.versions.length - idx}`,
      id: v.id,
      status: "Successful" as const,
    }));
  }, [data?.entity_data?.policy_id]);

  const versionDropdownOptions = useMemo(
    () =>
      policyVersions.map((item) => ({
        label: item.version,
        value: item.id,
        status: item.status,
        date: new Date(item.updated_at).toLocaleDateString("en-GB"),
        isDisabled: false,
      })),
    [policyVersions]
  );

  const currentVersionId = useMemo(() => {
    if (!data?.entity_data?.file_id || policyVersions.length === 0) return "";
    const match = policyVersions.find(
      (v) => v.id === data.entity_data.file_id
    );
    return match?.id || policyVersions[0]?.id || data.entity_data.file_id;
  }, [data, policyVersions]);

  useEffect(() => {
    if (currentVersionId && !selectedVersionId) {
      setSelectedVersionId(currentVersionId);
    }
  }, [currentVersionId]);

  useEffect(() => {
    if (
      data?.entity_data?.category_id &&
      data?.entity_data?.policy_id &&
      selectedVersionId
    ) {
      mutate({
        category_id: data.entity_data.category_id,
        policy_id: data.entity_data.policy_id,
        file_id: selectedVersionId,
      });
    }
  }, [data, selectedVersionId]);

  const priorityKey = (data?.priority || "").toUpperCase();
  const priorityStyle = PriorityBadge[priorityKey] || PriorityBadge.MEDIUM;
  const changeTypeLabel =
    CHANGE_TYPE_LABELS[data?.entity_data?.change_type || ""] || "Modification";

  const contextItems = [
    { label: "Action", value: changeTypeLabel },
    {
      label: "Category",
      value: getLoanCategoryTypeById(
        data?.entity_data?.category_id || "",
        loanCategories
      ),
    },
    { label: "Owner", value: data?.maker?.user_name },
    {
      label: "Status",
      value: `Awaiting L${data?.current_level} Approval`,
    },
  ];

  const timelineSteps = useMemo(() => adaptTimelineResp(data), [data]);

  const changes = data?.changes || [];
  const changeSummary = useMemo(() => {
    const s = { additions: 0, deletions: 0, updates: 0, total: 0, pending: 0 };
    changes.forEach((ch) => {
      s.total++;
      if (ch.type === "addition") s.additions++;
      else if (ch.type === "deletion") s.deletions++;
      else s.updates++;
      if (ch.status === "pending") s.pending++;
    });
    return s;
  }, [changes]);

  return (
    <PageLayout>
      <HeaderBackCta
        navigateTo={`${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.BASE}`}
      />

      {!data ? (
        <Flex w="full" h="full" justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <Flex direction="column" h="full" gap={0} overflow="hidden">
          {/* Zone 1: Sticky Header */}
          <Flex
            align="center"
            justify="space-between"
            px={6}
            py={3}
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.100"
            flexShrink={0}
            borderRadius="12px 12px 0 0"
          >
            <Flex align="center" gap={3}>
              <CustomText stylearr={[20, 26, 700]} color="#1A202C">
                {data.entity_data?.policy_name || ""}
              </CustomText>
              <Box
                px={3}
                py={0.5}
                borderRadius="6px"
                style={priorityStyle}
              >
                <CustomText stylearr={[10, 16, 700]}>
                  {data.priority?.toUpperCase()}
                </CustomText>
              </Box>
            </Flex>
          </Flex>

          {/* Zone 2: Context Bar */}
          <Flex
            px={6}
            py={2.5}
            gap={8}
            bg="#FAFAFA"
            borderBottom="1px solid"
            borderColor="gray.100"
            flexShrink={0}
          >
            {contextItems.map((item) => (
              <Flex key={item.label} gap={2} align="center">
                <CustomText stylearr={[11, 16, 500]} color="#9CA3AF">
                  {item.label}:
                </CustomText>
                <CustomText stylearr={[12, 16, 600]} color="#4B5563">
                  {item.value}
                </CustomText>
              </Flex>
            ))}
          </Flex>

          {/* Zone 3: Main Split */}
          <Flex
            flex={1}
            overflow="hidden"
            bg="white"
            borderRadius="0 0 12px 12px"
          >
            {/* Left Column — Policy Preview */}
            <Flex flex={1} direction="column" overflow="hidden" p={4} pr={2}>
              <Flex
                align="center"
                gap={3}
                px={4}
                py={2.5}
                bg="gray.50"
                borderBottom="1px solid"
                borderColor="gray.200"
                flexShrink={0}
                borderRadius="12px 12px 0 0"
                border="1px solid"
              >
                <CustomText stylearr={[12, 18, 600]} color="#6B7280">
                  Version:
                </CustomText>
                <Box minW="140px">
                  <VersionDropdown
                    title=""
                    options={versionDropdownOptions}
                    value={selectedVersionId}
                    onChange={setSelectedVersionId}
                    placeholder="Select version"
                  />
                </Box>
              </Flex>
              <Box
                flex={1}
                overflow="auto"
                border="1px solid"
                borderColor="gray.200"
                borderTop="none"
                borderRadius="0 0 12px 12px"
              >
                {isFileLoading || !fileData ? (
                  <Flex w="full" h="300px" justify="center" align="center">
                    <Spinner />
                  </Flex>
                ) : (
                  fileData.htmlContent && (
                    <DocViewer
                      htmlContent={fileData.htmlContent}
                      fileName={fileData.file_name}
                      readOnly
                      flexGrow={1}
                    />
                  )
                )}
              </Box>
            </Flex>

            {/* Right Column — Timeline + Sticky Changes Card */}
            <Flex
              direction="column"
              w="360px"
              flexShrink={0}
              borderLeft="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              {/* Scrollable: Timeline + spacer + sticky Changes card */}
              <Box flex={1} overflow="auto" display="flex" flexDirection="column">
                <Box px={4} py={5} flexShrink={0}>
                  <VerticalTimeline data={timelineSteps} />
                </Box>
                {/* Extra space so when scrolled, last timeline items stay visible above sticky card */}
                <Box minH="220px" flexShrink={0} />
                {/* Sticky at bottom: Changes to Review card */}
                {changeSummary.total > 0 && (
                  <Box
                    position="sticky"
                    bottom={0}
                    w="full"
                    flexShrink={0}
                    bg="white"
                    pt={3}
                    pb={4}
                    px={4}
                    mt="auto"
                    borderTop="1px solid"
                    borderColor="gray.200"
                    shadow="0 -2px 8px rgba(0,0,0,0.04)"
                  >
                  <Flex
                    direction="column"
                    gap={3}
                    p={4}
                    bg="#F7FAFC"
                    borderRadius="10px"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Flex align="center" justify="space-between">
                      <CustomText stylearr={[13, 18, 700]} color="#1A202C">
                        Changes to Review
                      </CustomText>
                      <Box
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        bg={changeSummary.pending > 0 ? "#FFF5F5" : "#F0FFF4"}
                      >
                        <CustomText
                          stylearr={[11, 14, 700]}
                          color={changeSummary.pending > 0 ? "#E53E3E" : "#38A169"}
                        >
                          {changeSummary.pending > 0
                            ? `${changeSummary.pending} pending`
                            : "All reviewed"}
                        </CustomText>
                      </Box>
                    </Flex>

                    <Flex gap={3} flexWrap="wrap">
                      {changeSummary.additions > 0 && (
                        <Flex align="center" gap={1.5}>
                          <FiPlus size={13} color="#38A169" />
                          <CustomText stylearr={[12, 16, 600]} color="#276749">
                            {changeSummary.additions} addition{changeSummary.additions !== 1 ? "s" : ""}
                          </CustomText>
                        </Flex>
                      )}
                      {changeSummary.updates > 0 && (
                        <Flex align="center" gap={1.5}>
                          <FiRefreshCw size={13} color="#D69E2E" />
                          <CustomText stylearr={[12, 16, 600]} color="#744210">
                            {changeSummary.updates} update{changeSummary.updates !== 1 ? "s" : ""}
                          </CustomText>
                        </Flex>
                      )}
                      {changeSummary.deletions > 0 && (
                        <Flex align="center" gap={1.5}>
                          <FiMinus size={13} color="#E53E3E" />
                          <CustomText stylearr={[12, 16, 600]} color="#9B2C2C">
                            {changeSummary.deletions} deletion{changeSummary.deletions !== 1 ? "s" : ""}
                          </CustomText>
                        </Flex>
                      )}
                    </Flex>

                    <CustomButton
                      variant="quaternary"
                      h="40px"
                      fontSize="13px"
                      fontWeight={600}
                      borderRadius="8px"
                      rightIcon={<FiArrowRight size={16} />}
                      onClick={() =>
                        navigate(
                          `${BASE_ROUTES[userType]}/maker-checker/approval/${id}/review`
                        )
                      }
                    >
                      Review Changes
                    </CustomButton>
                  </Flex>
                </Box>
                )}
              </Box>
            </Flex>
          </Flex>
        </Flex>
      )}

    </PageLayout>
  );
};

export default ApprovalTimeline;
