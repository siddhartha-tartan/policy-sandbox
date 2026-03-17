import { CloseButton, Flex, useDisclosure } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EventBus from "../../../../EventBus";
import sanitizeHtmlContent from "../../../../utils/helpers/sanitizeHtmlContent";
import PageLayout from "../../../common/PageLayout";
import PdfViewer2, { EVENT_OPEN_PDF_PAGE } from "../../../common/PdfViewer2";
import useGetFile from "../../../common/Policy/hooks/useGetFile";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import ConversationBox from "../../components/ConversationBox";
import CustomFeedbackModal from "../../components/CustomFeedbackModal";
import GPTResponseLoading from "../../components/GPTResponseLoading";
import PromptInput from "../../components/PromptInput";
import ThreadsBox from "../../components/ThreadsBox";
import useCreateNewConversation from "../../hooks/useCreateNewConversation";
import useFeedback from "../../hooks/useFeedback";
import useGetMessages from "../../hooks/useGetMessages";
import {
  conversationAtom,
  isLoadingAtom,
  queryAtom,
  selectedPoliciesAtom,
} from "../../polygptAtom";

const EVENT_PDF_LOADED = "EVENT_PDF_LOADED";

export default function IndivisualGPT() {
  const { data } = useGetMessages();
  const [query, setQuery] = useAtom(queryAtom);
  const { id } = useParams<{ id: string }>();
  const { mutate: createConversation } = useCreateNewConversation();
  const selectedFiles = useAtomValue(selectedPoliciesAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [pdfLink, setPdfLink] = useState("");
  const { mutate, data: fileData } = useGetFile();
  const [conversations, setConversations] = useAtom(conversationAtom);
  const [responseFile, setResponseFile] = useState<{
    fileId: string;
    categoryId: string;
    pageNumber: number;
    policyId: string;
  } | null>(null);
  const [openPage, setOpenPage] = useState(0);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_PDF_LOADED, setIsPdfLoaded);
    return () => EventBus.getInstance().removeListener(setIsPdfLoaded);
  }, []);

  useEffect(() => {
    if (isPdfLoaded)
      EventBus.getInstance().fireEvent(EVENT_OPEN_PDF_PAGE, openPage - 1);
  }, [isPdfLoaded, openPage]);

  const ref = useRef<HTMLDivElement>(null);

  const loadTillBottom = () => {
    ref?.current?.scrollTo({
      top: 1000000000,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setPdfLink("");
  }, [id]);

  useEffect(() => {
    if (data) {
      if (isOpen) {
        onClose();
      }
    }
  }, [data, ref, ref?.current]);

  useEffect(() => {
    setTimeout(() => {
      loadTillBottom();
    }, 100);
  }, [conversations, isLoading]);

  useEffect(() => {
    setPdfLink(fileData);
  }, [fileData]);
  useFeedback();

  const getFile = () => {
    setIsPdfLoaded(false);
    mutate(
      {
        category_id: responseFile?.categoryId!,
        policy_id: responseFile?.policyId!,
        file_id: responseFile?.fileId!,
      },
      {
        onSuccess(successData) {
          setPdfLink(successData);
          setIsPdfLoaded(true);
          setOpenPage(responseFile?.pageNumber || 1);
          onOpen();
        },
      },
    );
  };

  useEffect(getFile, [
    responseFile?.categoryId,
    responseFile?.fileId,
    responseFile?.policyId,
  ]);

  const handlePolicyClick = (
    policyId: string,
    categoryId: string,
    fileId: string,
    pageNumber: number,
  ) => {
    if (fileId === responseFile?.fileId) {
      if (fileData) {
        setPdfLink(fileData);
      } else {
        getFile();
      }
      onOpen();
      setOpenPage(pageNumber);
    } else {
      setResponseFile({ fileId: fileId, categoryId, pageNumber, policyId });
    }
  };

  return (
    <PageLayout pt={0}>
      <Flex className="w-full h-full overflow-y-auto justify-center items-center relative">
        <ThreadsBox />
        <Flex className="w-full h-full overflow-y-auto flex justify-end">
          <Flex
            className="h-full flex gap-[20px] overflow-y-auto justify-center items-center"
            style={{ width: isOpen ? "calc(100% - 50px)" : "100%" }}
          >
            <Flex
              className={`items-center transition-all overflow-y-auto justify-center flex flex-col h-full gap-[20px] ${
                isOpen ? "flex-1" : "w-[817px] max-w-[80%]"
              }`}
            >
              <div
                className="w-full h-full overflow-y-auto flex-grow pt-[20px]"
                ref={ref}
              >
                {conversations?.length == 0 ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <CustomText stylearr={[14, 20, 24]}>
                      No Conversation Found
                    </CustomText>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col gap-[10px]">
                    {conversations?.map((row) => {
                      return (
                        <ConversationBox
                          row={row}
                          key={`conversation-box-${row?.message_id}`}
                          userBoxWidth={"fit-content"}
                          userBoxMaxWidth={!isOpen ? "75%" : "100%"}
                          handlePolicyClick={handlePolicyClick}
                        />
                      );
                    })}
                    {isLoading && (
                      <div className="w-full">
                        <GPTResponseLoading />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full py-[20px]">
                <PromptInput
                  onSubmit={() => {
                    const sanitizedQuery = sanitizeHtmlContent(query);
                    if (sanitizedQuery) {
                      createConversation({
                        prompt: sanitizedQuery,
                        file_ids:
                          selectedFiles?.map((file) => file.files.id) || null,
                        conversation_id: id!,
                      });
                      const temp = [
                        ...conversations,
                        { prompt: sanitizedQuery, response: "" },
                      ];
                      //@ts-ignore
                      setConversations(temp);
                      setQuery("");
                    }
                  }}
                  placeholder="Reply to PolyGPT"
                  textAreaInput={false}
                />
              </div>
            </Flex>
            <Flex
              className={`${
                isOpen
                  ? "flex-1"
                  : "flex-grow-0 flex-none w-0 max-w-0 overflow-hidden"
              } h-full transition-all duration-300 pt-2 pb-5 flex flex-col gap-3`}
            >
              <div className="flex items-center text-[16px] font-[500] text-[#141414]">
                <CloseButton
                  onClick={() => onClose()}
                  className="cursor-pointer"
                />
                <p>Policy preview</p>
              </div>
              {pdfLink && isOpen && (
                <PdfViewer2 pdfUrl={pdfLink} refetch={getFile} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <CustomFeedbackModal />
    </PageLayout>
  );
}
