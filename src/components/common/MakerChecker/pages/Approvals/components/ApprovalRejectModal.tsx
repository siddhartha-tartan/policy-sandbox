import { Flex, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import EventBus from "../../../../../../EventBus";
import { systemColors } from "../../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomModal from "../../../../CustomModal";
import useApproveRejectApproval from "../../../common/hooks/useApproveRejectApproval";
import { selectionActionRequestIdRow } from "../atom";

export const EVENT_OPEN_REJECT_APPROVAL_MODAL =
  "EVENT_OPEN_REJECT_APPROVAL_MODAL";

export default function ApprovalRejectModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [comment, setComment] = useState<string>("");
  const { mutate, isLoading } = useApproveRejectApproval();
  const requestId = useAtomValue(selectionActionRequestIdRow);

  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_REJECT_APPROVAL_MODAL,
      onOpen
    );
    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      className="p-6 pt-8 w-[500px] "
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="font-bold text-[22px] text-[#141414]">
            Reject Request
          </div>
          <Text
            mb={4}
            color="gray.600"
            className="text-sm flex justify-center items-center text-center font-medium"
          >
            Please provide a brief explanation for your decision
            <br />
            to reject the request.
          </Text>
        </div>
        <div>
          <Flex flexDirection="column" gap={2}>
            <Text
              fontWeight="medium"
              className="text-[#141414] text-sm font-normal"
            >
              Additional Comments (Optional)
            </Text>
            <Textarea
              placeholder="Add any relevant comments about this policy..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              borderColor="gray.300"
              className="placeholder:font-medium placeholder:text-sm"
              resize="vertical"
            />
          </Flex>
        </div>

        <div>
          <Flex w="full" gap="24px">
            <CustomButton
              borderRadius="8px"
              className="text-sm font-medium"
              borderColor={systemColors.black[200]}
              variant="tertiary"
              flex={1}
              onClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              bgColor={systemColors.grey[900]}
              className="text-sm font-semibold"
              style={{
                background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
              }}
              borderRadius="8px"
              flex={1}
              isLoading={isLoading}
              onClick={() => {
                if (requestId)
                  mutate(
                    {
                      request_id: requestId,
                      comments: comment,
                      action_type: "REJECT",
                    },
                    {
                      onSuccess() {
                        onClose();
                      },
                    }
                  );
              }}
            >
              Confirm Submission
            </CustomButton>
          </Flex>
        </div>
      </div>
    </CustomModal>
  );
}
