import { Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Lottie from "lottie-react";
import loading from "../../../../assets/Animations/SearchingDocument.json";
import sanitizeHtmlContent from "../../../../utils/helpers/sanitizeHtmlContent";
import PageLayout from "../../../common/PageLayout";
import PromptInput from "../../components/PromptInput";
import ThreadsBox from "../../components/ThreadsBox";
import useCreateNewConversation from "../../hooks/useCreateNewConversation";
import {
  isLoadingAtom,
  queryAtom,
  selectedPoliciesAtom,
} from "../../polygptAtom";
import ExamplePrompts from "./components/ExamplePrompts";
import GPTHeader from "./components/GPTHeader";

export default function NewGPT() {
  const isLoading = useAtomValue(isLoadingAtom);
  const selectedFiles = useAtomValue(selectedPoliciesAtom);
  const query = useAtomValue(queryAtom);
  const { mutate } = useCreateNewConversation(true);

  return (
    <PageLayout pt={0}>
      <Flex className="w-full h-full justify-center items-center relative">
        <ThreadsBox />
        <Flex
          className={`w-[817px] max-w-[80%] items-center justify-center flex flex-col h-full gap-[80px]`}
        >
          <Flex className="flex flex-col gap-[40px] justify-center items-center w-full h-fit">
            <GPTHeader />
            <PromptInput
              onSubmit={() => {
                // if (selectedPolicy && selectedCategoryId && query) {
                const sanitizedQuery = sanitizeHtmlContent(query);
                if (sanitizedQuery) {
                  mutate({
                    prompt: sanitizedQuery,
                    file_ids:
                      selectedFiles?.map((file) => file.files.id) || null,
                  });
                }
              }}
              textAreaInput={true}
            />
          </Flex>
          <div className="w-full min-h-[200px] relative">
            <AnimatePresence>
              {!isLoading ? (
                <motion.div
                  key="examplePrompts"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: isLoading ? 0.4 : 0 }}
                  className="w-full absolute top-0 left-0"
                >
                  <ExamplePrompts />
                </motion.div>
              ) : (
                <motion.div
                  key="loadingShimmer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: isLoading ? 0.3 : 0 }}
                  className="w-full absolute top-0 left-0 mt-[-40px]"
                >
                  <Lottie
                    animationData={loading}
                    loop={true}
                    style={{
                      flexGrow: 1,
                      width: "100%",
                      height: "100px",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Flex>
      </Flex>
    </PageLayout>
  );
}
