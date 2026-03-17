import {
  CloseButton,
  Flex,
  HStack,
  Spinner,
  StackDivider,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import EventBus from "../../../../../../EventBus";
import CustomModal from "../../../../../common/CustomModal";
import PdfViewer2 from "../../../../../common/PdfViewer2";
import useGetFile from "../../../../../common/Policy/hooks/useGetFile";
import Rules from "./Rules";
export const EVENT_OPEN_COMPARE_MODAL = "EVENT_OPEN_COMPARE_MODAL";

export default function CompareModal() {
  const { policyId, categoryId, fileId } = useParams<{
    policyId: string;
    categoryId: string;
    fileId: string;
  }>();
  const { mutate, data: fileData } = useGetFile();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const getFile = () => {
    mutate({
      category_id: categoryId!,
      policy_id: policyId!,
      file_id: fileId || "",
    });
  };

  useEffect(() => {
    if (fileId && policyId && categoryId) getFile();
  }, [fileId, policyId, categoryId]);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_COMPARE_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, []);

  return (
    <CustomModal
      w={"90dvw"}
      h={"90dvh"}
      className="rounded-[16px] bg-white p-4 flex flex-col gap-[42px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CloseButton
        className="absolute top-3 right-4 cursor-pointer bg-transparent border-none z-50"
        onClick={onClose}
      />

      <HStack
        divider={<StackDivider />}
        className="gap-2 h-full w-full relative"
      >
        <Flex flex={1} className="overflow-y-auto w-full h-full rounded-lg">
          {!fileData ? (
            <Flex className="justify-center items-center w-full">
              <Spinner />
            </Flex>
          ) : (
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <PdfViewer2
                refetch={getFile}
                pdfUrl={fileData}
                flexGrow={1}
                className="w-full min-h-full"
              />
            </ErrorBoundary>
          )}
        </Flex>
        <Flex flex={1} className="overflow-y-auto w-full h-full">
          <Rules />
        </Flex>
      </HStack>
    </CustomModal>
  );
}
