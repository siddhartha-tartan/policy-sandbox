import {
  Badge,
  Box,
  Flex,
  Spinner,
  Textarea,
  Collapse,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiX,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiMessageCircle,
  FiSend,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { MOCK_POLICIES, type PolicyChange } from "../../../../../mock/mockData";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import DocViewer from "../../../DocViewer";
import PageLayout from "../../../PageLayout";
import useGetFile from "../../../Policy/hooks/useGetFile";
import useGetApprovalTimeline from "./hooks/useGetApprovalTimeline";

const TYPE_CONFIG = {
  addition: {
    label: "Added",
    color: "#276749",
    bg: "#F0FFF4",
    borderColor: "#C6F6D5",
    accentColor: "#38A169",
    icon: FiPlus,
  },
  deletion: {
    label: "Removed",
    color: "#9B2C2C",
    bg: "#FFF5F5",
    borderColor: "#FED7D7",
    accentColor: "#E53E3E",
    icon: FiMinus,
  },
  update: {
    label: "Modified",
    color: "#744210",
    bg: "#FFFFF0",
    borderColor: "#FEFCBF",
    accentColor: "#D69E2E",
    icon: FiMessageCircle,
  },
};

interface ChangeWithComment extends PolicyChange {
  comment?: string;
}

function ChangeCard({
  change,
  index,
  total,
  onStatusUpdate,
  onCommentUpdate,
  isScrollTarget,
}: {
  change: ChangeWithComment;
  index: number;
  total: number;
  onStatusUpdate: (id: string, status: "approved" | "rejected") => void;
  onCommentUpdate: (id: string, comment: string) => void;
  isScrollTarget: boolean;
}) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [localComment, setLocalComment] = useState(change.comment || "");
  const cardRef = useRef<HTMLDivElement>(null);
  const typeConf = TYPE_CONFIG[change.type];

  useEffect(() => {
    if (isScrollTarget && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isScrollTarget]);

  return (
    <Box
      ref={cardRef}
      id={`change-card-${change.id}`}
      bg={systemColors.white.absolute}
      borderRadius="8px"
      border="1px solid"
      borderColor={systemColors.grey[200]}
      overflow="hidden"
      transition="border-color 0.2s, box-shadow 0.2s"
      _hover={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {/* Header row: field, badge, index, actions */}
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor={systemColors.grey[100]}
      >
        <CustomText stylearr={[13, 18, 600]} color={systemColors.grey[900]} flex={1} noOfLines={1}>
          {change.field}
        </CustomText>
        <Badge
          fontSize="10px"
          px={2}
          py={0.5}
          borderRadius="4px"
          bg={systemColors.grey[100]}
          color={systemColors.grey[700]}
          textTransform="uppercase"
          fontWeight={600}
        >
          {typeConf.label}
        </Badge>
        <CustomText stylearr={[11, 14, 500]} color={systemColors.grey[500]}>
          {index + 1}/{total}
        </CustomText>
        {/* Inline actions — outline when unselected, filled when selected */}
        <Flex gap={2} flexShrink={0}>
          <CustomButton
            variant="tertiary"
            size="sm"
            h="28px"
            px={3}
            fontSize="11px"
            fontWeight={600}
            borderRadius="6px"
            leftIcon={<FiCheck size={12} />}
            isDisabled={change.status === "rejected"}
            style={
              change.status === "approved"
                ? { background: systemColors.success[600], color: "white", border: "none" }
                : undefined
            }
            onClick={() => onStatusUpdate(change.id, "approved")}
          >
            Approve
          </CustomButton>
          <CustomButton
            variant="tertiary"
            size="sm"
            h="28px"
            px={3}
            fontSize="11px"
            fontWeight={600}
            borderRadius="6px"
            leftIcon={<FiX size={12} />}
            isDisabled={change.status === "approved"}
            style={
              change.status === "rejected"
                ? { background: systemColors.error[600], color: "white", border: "none" }
                : undefined
            }
            onClick={() => onStatusUpdate(change.id, "rejected")}
          >
            Decline
          </CustomButton>
        </Flex>
      </Flex>

      {/* Content — subtle tints for Before/After distinction */}
      <Box px={4} py={3}>
        {(change.type === "update" || change.type === "deletion") && change.oldValue && (
          <Box
            mb={change.type === "update" ? 2.5 : 0}
            p={3}
            bg="rgba(254, 243, 242, 0.7)"
            borderRadius="6px"
            borderLeft="3px solid"
            borderColor="rgba(220, 38, 38, 0.5)"
          >
            <CustomText stylearr={[10, 14, 600]} color="#B91C1C" mb={1}>
              {change.type === "deletion" ? "Removed" : "Before"}
            </CustomText>
            <CustomText
              stylearr={[12, 18, 400]}
              color={systemColors.grey[700]}
              textDecoration={change.type === "deletion" ? "line-through" : "none"}
              opacity={change.type === "deletion" ? 0.7 : 1}
            >
              {change.oldValue}
            </CustomText>
          </Box>
        )}
        {(change.type === "update" || change.type === "addition") && change.newValue && (
          <Box
            p={3}
            bg="rgba(236, 253, 245, 0.8)"
            borderRadius="6px"
            borderLeft="3px solid"
            borderColor="rgba(34, 197, 94, 0.5)"
          >
            <CustomText stylearr={[10, 14, 600]} color="#15803D" mb={1}>
              {change.type === "addition" ? "Added" : "After"}
            </CustomText>
            <CustomText stylearr={[12, 18, 400]} color={systemColors.grey[700]}>
              {change.newValue}
            </CustomText>
          </Box>
        )}
      </Box>

      {/* Comment — collapsible */}
      <Flex
        align="center"
        gap={2}
        px={4}
        pb={commentOpen ? 0 : 3}
        cursor="pointer"
        onClick={() => setCommentOpen(!commentOpen)}
      >
        <FiMessageCircle size={13} color={systemColors.grey[500]} />
        <CustomText stylearr={[11, 16, 500]} color={systemColors.grey[500]} _hover={{ color: systemColors.grey[700] }}>
          {localComment ? "View comment" : "Add comment"}
        </CustomText>
        {localComment && (
          <Box w="6px" h="6px" borderRadius="full" bg={systemColors.indigo[350]} flexShrink={0} />
        )}
        <Box flex={1} />
        {commentOpen ? <FiChevronUp size={13} color={systemColors.grey[500]} /> : <FiChevronDown size={13} color={systemColors.grey[500]} />}
      </Flex>
      <Collapse in={commentOpen}>
        <Box px={4} pb={3} pt={2}>
          <Textarea
            value={localComment}
            onChange={(e) => setLocalComment(e.target.value)}
            onBlur={() => onCommentUpdate(change.id, localComment)}
            placeholder="Leave a comment for this change..."
            size="sm"
            fontSize="12px"
            borderRadius="8px"
            borderColor={systemColors.grey[300]}
            rows={2}
            resize="none"
            _focus={{ borderColor: systemColors.indigo[350], boxShadow: `0 0 0 1px ${systemColors.indigo[350]}` }}
          />
        </Box>
      </Collapse>
    </Box>
  );
}

export default function ReviewChangesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useGetUserType();
  const { data } = useGetApprovalTimeline(id);
  const { mutate, isLoading: isFileLoading, data: fileData } = useGetFile();

  const [changes, setChanges] = useState<ChangeWithComment[]>([]);
  const [scrollTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.changes) {
      setChanges(data.changes.map((ch) => ({ ...ch, comment: "" })));
    }
  }, [data?.changes]);

  const currentVersionId = useMemo(() => {
    if (!data?.entity_data?.policy_id) return "";
    const mockPolicy = MOCK_POLICIES.find(
      (p) => p.id === data.entity_data.policy_id
    );
    if (!mockPolicy) return "";
    const match = mockPolicy.versions.find(
      (v) => v.id === data.entity_data.file_id
    );
    return match?.id || mockPolicy.versions[0]?.id || data.entity_data.file_id;
  }, [data]);

  useEffect(() => {
    if (
      data?.entity_data?.category_id &&
      data?.entity_data?.policy_id &&
      currentVersionId
    ) {
      mutate({
        category_id: data.entity_data.category_id,
        policy_id: data.entity_data.policy_id,
        file_id: currentVersionId,
      });
    }
  }, [data, currentVersionId]);

  const handleStatusUpdate = useCallback(
    (changeId: string, status: "approved" | "rejected") => {
      setChanges((prev) =>
        prev.map((ch) => (ch.id === changeId ? { ...ch, status } : ch))
      );
    },
    []
  );

  const handleCommentUpdate = useCallback(
    (changeId: string, comment: string) => {
      setChanges((prev) =>
        prev.map((ch) => (ch.id === changeId ? { ...ch, comment } : ch))
      );
    },
    []
  );

  const handleApproveAll = useCallback(() => {
    setChanges((prev) =>
      prev.map((ch) =>
        ch.status === "pending" ? { ...ch, status: "approved" as const } : ch
      )
    );
  }, []);

  const handleRejectAll = useCallback(() => {
    setChanges((prev) =>
      prev.map((ch) =>
        ch.status === "pending" ? { ...ch, status: "rejected" as const } : ch
      )
    );
  }, []);

  const counts = useMemo(() => {
    const c = { approved: 0, rejected: 0, pending: 0, total: changes.length };
    changes.forEach((ch) => c[ch.status]++);
    return c;
  }, [changes]);

  const allReviewed = counts.pending === 0 && counts.total > 0;
  const backUrl = `${BASE_ROUTES[userType]}/maker-checker/approval/${id}`;

  const handleSubmit = useCallback(() => {
    navigate(backUrl);
  }, [navigate, backUrl]);

  return (
    <PageLayout>
      <Flex direction="column" h="full" minH="0" gap={0}>
      {/* Top Bar */}
      <Flex
        align="center"
        gap={3}
        px={5}
        py={2.5}
        bg="white"
        borderRadius="12px"
        border="1px solid"
        borderColor={systemColors.grey[200]}
        mb={3}
        flexShrink={0}
      >
        <CustomButton
          variant="tertiary"
          size="sm"
          h="32px"
          borderRadius="8px"
          leftIcon={<FiArrowLeft size={14} />}
          borderColor={systemColors.grey[300]}
          fontSize="12px"
          fontWeight={500}
          onClick={() => navigate(backUrl)}
        >
          Back
        </CustomButton>
        <Box w="1px" h="18px" bg={systemColors.grey[200]} />
        <CustomText stylearr={[15, 20, 700]} color={systemColors.grey[900]}>
          Review Changes
        </CustomText>
        <CustomText stylearr={[12, 18, 500]} color={systemColors.grey[500]}>
          — {data?.entity_data?.policy_name}
        </CustomText>
        <Box flex={1} />
        <CustomButton
          variant="quaternary"
          h="38px"
          px={4}
          fontSize="13px"
          fontWeight={700}
          borderRadius="8px"
          leftIcon={<FiSend size={14} />}
          isDisabled={!allReviewed}
          _disabled={{
            opacity: 0.6,
            cursor: "not-allowed",
          }}
          style={{
            background: allReviewed
              ? "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
              : systemColors.grey[200],
            color: allReviewed ? "white" : systemColors.grey[600],
            border: "none",
          }}
          onClick={handleSubmit}
        >
          {allReviewed
            ? "Submit Review"
            : `Review remaining ${counts.pending} change${counts.pending !== 1 ? "s" : ""}`}
        </CustomButton>
      </Flex>

      {/* Main Split — left and right independently scrollable */}
      <Flex flex={1} minH={0} gap={3} overflow="hidden">
        {/* Left — Policy Document (independently scrollable) */}
        <Flex
          flex={1}
          direction="column"
          overflow="hidden"
          minH={0}
          bg={systemColors.white.absolute}
          borderRadius="12px"
          border="1px solid"
          borderColor={systemColors.grey[200]}
        >
          <Flex
            px={4}
            py={2.5}
            bg={systemColors.grey[50]}
            borderBottom="1px solid"
            borderColor={systemColors.grey[200]}
            flexShrink={0}
            align="center"
          >
            <CustomText stylearr={[12, 18, 600]} color={systemColors.grey[700]}>
              Policy Document
            </CustomText>
          </Flex>
          <Box flex={1} overflow="auto" minH={0}>
              {isFileLoading || !fileData ? (
                <Flex w="full" h="full" justify="center" align="center">
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

        {/* Right — Changes Panel (independently scrollable) */}
        <Flex
          direction="column"
          w="440px"
          flexShrink={0}
          overflow="hidden"
          minH={0}
          bg={systemColors.white.absolute}
          borderRadius="12px"
          border="1px solid"
          borderColor={systemColors.grey[200]}
        >
          {/* Accept All / Reject All — full-width, prominent outline buttons */}
          <Flex gap={3} px={4} py={4} borderBottom="1px solid" borderColor={systemColors.grey[200]} flexShrink={0}>
            <CustomButton
              variant="tertiary"
              flex={1}
              h="40px"
              fontSize="13px"
              fontWeight={700}
              borderRadius="8px"
              leftIcon={<FiCheck size={15} />}
              onClick={handleApproveAll}
            >
              Accept All
            </CustomButton>
            <CustomButton
              variant="tertiary"
              flex={1}
              h="40px"
              fontSize="13px"
              fontWeight={700}
              borderRadius="8px"
              leftIcon={<FiX size={15} />}
              onClick={handleRejectAll}
            >
              Reject All
            </CustomButton>
          </Flex>
          <Box
            flex={1}
            overflow="auto"
            minH={0}
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: systemColors.grey[300],
                borderRadius: "4px",
              },
            }}
          >
              <Flex direction="column" gap={3} p={4} flexShrink={0}>
                {changes.map((ch, i) => (
                  <ChangeCard
                    key={ch.id}
                    change={ch}
                    index={i}
                    total={changes.length}
                    onStatusUpdate={handleStatusUpdate}
                    onCommentUpdate={handleCommentUpdate}
                    isScrollTarget={scrollTargetId === ch.id}
                  />
                ))}
              </Flex>
            </Box>
        </Flex>
      </Flex>
      </Flex>
    </PageLayout>
  );
}
