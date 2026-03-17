import { Box, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import EventBus from "../../../../../EventBus";
import { detectChanges, type PolicyChange } from "../../../../../utils/changeDetection";
import Action from "../../../../PolicyGen/pages/PolicyDetail/components/Action";
import { CommentComponent } from "../../../CommentComponent/CommentComponent";
import DocViewer from "../../../DocViewer";
import useEditPolicy from "../../hooks/useEditPolicy";
import useGetFile from "../../hooks/useGetFile";
import { PolicyDetails as IPolicyDetails } from "../../hooks/useGetPolicyDetails";
import ChangeSubmissionModal from "../../../MakerChecker/pages/ApprovalTimeline/components/ChangeSubmissionModal";
import { EVENT_OPEN_POLICY_SENT_MODAL } from "../../../../Polycraft/components/PolicySentModal";

export default function PolicyDetails({
  data,
  policyId,
  isReviewPending,
}: {
  data: IPolicyDetails;
  policyId: string;
  isReviewPending?: boolean;
}) {
  const { fileId } = useParams<{ fileId: string }>();
  const query = new URLSearchParams(useLocation().search);
  const versionId = query.get("versionId");

  const fileVersion = versionId || fileId || "";
  const { mutate, isLoading, data: fileData } = useGetFile();
  const { mutate: editPolicy, isLoading: isEditLoading } = useEditPolicy();
  const submissionModal = useDisclosure();

  const originalHtmlRef = useRef<string>("");
  const [detectedChanges, setDetectedChanges] = useState<PolicyChange[]>([]);
  const [pendingContent, setPendingContent] = useState<string>("");

  const getFile = () => {
    mutate({
      category_id: data?.subcategory_id || data?.loan_category_id,
      policy_id: policyId,
      file_id: fileVersion || data?.pdf_url,
    });
  };

  useEffect(() => {
    if (data?.loan_category_id && policyId && data?.pdf_url) getFile();
  }, [fileVersion, policyId, data]);

  useEffect(() => {
    if (fileData?.htmlContent) {
      originalHtmlRef.current = fileData.htmlContent;
    }
  }, [fileData?.htmlContent]);

  const handleSave = useCallback(
    (updatedContent: string) => {
      const changes = detectChanges(originalHtmlRef.current, updatedContent);
      if (changes.length === 0) return;

      setDetectedChanges(changes);
      setPendingContent(updatedContent);
      submissionModal.onOpen();
    },
    [submissionModal]
  );

  const handleSubmitForApproval = useCallback(
    ({ priority, comment }: { priority: string; comment: string }) => {
      editPolicy(
        {
          policy_name: data?.name ?? "",
          description: data?.description ?? "",
          loan_category_id: data?.loan_category_id,
          notify_users: false,
          priority,
          comment,
          changes: detectedChanges,
          modified_html: pendingContent,
          original_html: originalHtmlRef.current,
          change_type: "inline_edit",
        } as any,
        {
          onSuccess() {
            submissionModal.onClose();
            setDetectedChanges([]);
            setPendingContent("");
            originalHtmlRef.current = pendingContent;
            setTimeout(
              () =>
                EventBus.getInstance().fireEvent(
                  EVENT_OPEN_POLICY_SENT_MODAL
                ),
              100
            );
          },
        }
      );
    },
    [data, detectedChanges, pendingContent, editPolicy, submissionModal]
  );

  return (
    <Flex w="full" h="full" flexGrow={1} gap="32px" overflowY="auto">
      <Box className="w-full overflow-y-auto h-full flex-grow border p-4 rounded-[16px]">
        {isLoading || !fileData ? (
          <Flex w="full" m="auto" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : (
          <>
            {fileData?.htmlContent && (
              <DocViewer
                htmlContent={fileData.htmlContent}
                fileName={fileData.file_name}
                onSave={handleSave}
                flexGrow={1}
              />
            )}
          </>
        )}
      </Box>

      {isReviewPending && data?.request_id ? (
        <CommentComponent requestId={data?.request_id} />
      ) : null}

      {versionId ? (
        <Action fileId={versionId} />
      ) : (
        <Action fileId={fileVersion || data?.pdf_url} />
      )}

      <ChangeSubmissionModal
        isOpen={submissionModal.isOpen}
        onClose={submissionModal.onClose}
        onSubmit={handleSubmitForApproval}
        isLoading={isEditLoading}
        changes={detectedChanges}
        changeType="inline_edit"
      />
    </Flex>
  );
}
