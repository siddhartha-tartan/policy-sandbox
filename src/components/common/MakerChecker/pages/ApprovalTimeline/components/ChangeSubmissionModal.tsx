import { Badge, Box, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlus, FiMinus, FiRefreshCw } from "react-icons/fi";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../../CustomModal";
import type { PolicyChange } from "../../../../../../mock/mockData";

const PRIORITY_OPTIONS = [
  { value: "HIGH", color: "#E53E3E", bg: "#FFF5F5" },
  { value: "MEDIUM", color: "#F9A825", bg: "#FFFFF0" },
  { value: "LOW", color: "#38A169", bg: "#F0FFF4" },
];

interface ChangeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { priority: string; comment: string }) => void;
  isLoading?: boolean;
  changes: PolicyChange[];
  changeType: "inline_edit" | "new_upload" | "version_upload";
}

export default function ChangeSubmissionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  changes,
  changeType,
}: ChangeSubmissionModalProps) {
  const [priority, setPriority] = useState("MEDIUM");
  const [comment, setComment] = useState("");

  const additions = changes.filter((c) => c.type === "addition").length;
  const updates = changes.filter((c) => c.type === "update").length;
  const deletions = changes.filter((c) => c.type === "deletion").length;

  const typeLabel =
    changeType === "new_upload"
      ? "New Policy Submission"
      : changeType === "inline_edit"
        ? "Inline Edit Submission"
        : "Version Update Submission";

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      className="p-6 pt-8 w-[520px]"
    >
      <Flex direction="column" gap={4} w="full">
        <Flex direction="column" align="center" gap={2}>
          <CustomText stylearr={[20, 26, 700]} color="#1A202C">
            Submit for Approval
          </CustomText>
          <CustomText
            stylearr={[13, 20, 400]}
            color="#718096"
            textAlign="center"
          >
            {typeLabel} — {changes.length} change
            {changes.length !== 1 ? "s" : ""} detected
          </CustomText>
        </Flex>

        <Flex gap={3} justify="center">
          {additions > 0 && (
            <Flex
              align="center"
              gap={1.5}
              px={3}
              py={1.5}
              bg="#F0FFF4"
              borderRadius="8px"
              border="1px solid #C6F6D5"
            >
              <FiPlus size={14} color="#38A169" />
              <CustomText stylearr={[12, 16, 600]} color="#276749">
                {additions} addition{additions !== 1 ? "s" : ""}
              </CustomText>
            </Flex>
          )}
          {updates > 0 && (
            <Flex
              align="center"
              gap={1.5}
              px={3}
              py={1.5}
              bg="#FFFFF0"
              borderRadius="8px"
              border="1px solid #FEFCBF"
            >
              <FiRefreshCw size={14} color="#D69E2E" />
              <CustomText stylearr={[12, 16, 600]} color="#744210">
                {updates} update{updates !== 1 ? "s" : ""}
              </CustomText>
            </Flex>
          )}
          {deletions > 0 && (
            <Flex
              align="center"
              gap={1.5}
              px={3}
              py={1.5}
              bg="#FFF5F5"
              borderRadius="8px"
              border="1px solid #FED7D7"
            >
              <FiMinus size={14} color="#E53E3E" />
              <CustomText stylearr={[12, 16, 600]} color="#9B2C2C">
                {deletions} deletion{deletions !== 1 ? "s" : ""}
              </CustomText>
            </Flex>
          )}
        </Flex>

        <Box
          maxH="180px"
          overflow="auto"
          borderRadius="8px"
          border="1px solid"
          borderColor="gray.200"
        >
          {changes.map((ch, i) => (
            <Flex
              key={ch.id}
              align="center"
              gap={2}
              px={3}
              py={2}
              borderBottom={i < changes.length - 1 ? "1px solid" : "none"}
              borderColor="gray.100"
            >
              <Badge
                fontSize="10px"
                px={1.5}
                borderRadius="3px"
                colorScheme={
                  ch.type === "addition"
                    ? "green"
                    : ch.type === "deletion"
                      ? "red"
                      : "yellow"
                }
              >
                {ch.type}
              </Badge>
              <CustomText
                stylearr={[12, 18, 500]}
                color="#4A5568"
                noOfLines={1}
                flex={1}
              >
                {ch.field}
              </CustomText>
            </Flex>
          ))}
        </Box>

        <Flex direction="column" gap={2}>
          <CustomText stylearr={[13, 18, 600]} color="#4A5568">
            Priority
          </CustomText>
          <Flex gap={2}>
            {PRIORITY_OPTIONS.map((opt) => (
              <Box
                key={opt.value}
                as="button"
                px={4}
                py={2}
                borderRadius="8px"
                border="2px solid"
                borderColor={
                  priority === opt.value ? opt.color : "gray.200"
                }
                bg={priority === opt.value ? opt.bg : "white"}
                onClick={() => setPriority(opt.value)}
                transition="all 0.15s"
              >
                <CustomText
                  stylearr={[12, 16, 600]}
                  color={priority === opt.value ? opt.color : "#718096"}
                >
                  {opt.value}
                </CustomText>
              </Box>
            ))}
          </Flex>
        </Flex>

        <Flex direction="column" gap={2}>
          <Text fontWeight="medium" fontSize="13px" color="#4A5568">
            Comment (Optional)
          </Text>
          <Textarea
            placeholder="Add context about these changes..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            borderColor="gray.300"
            fontSize="13px"
            resize="vertical"
            rows={3}
          />
        </Flex>

        <Flex w="full" gap={3}>
          <CustomButton
            borderRadius="8px"
            variant="tertiary"
            flex={1}
            borderColor={systemColors.black[200]}
            fontSize="14px"
            fontWeight={500}
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            borderRadius="8px"
            flex={1}
            fontSize="14px"
            fontWeight={600}
            isLoading={isLoading}
            style={{
              background:
                "linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)",
              color: "#FFF",
            }}
            onClick={() => onSubmit({ priority, comment })}
          >
            Submit for Approval
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
