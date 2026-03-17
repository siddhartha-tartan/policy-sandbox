import { Divider, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Copy, Tick } from "react-huge-icons/outline";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { chatAtom, selectedChatIndexAtom } from "../../../utils/atom";

const MotionFlex = motion(Flex);
const SyntaxHighlighterComponent =
  SyntaxHighlighter as unknown as React.FC<{
    language: string;
    style: Record<string, unknown>;
    customStyle?: React.CSSProperties;
    children: string;
  }>;

export default function GeneratedSQLTab() {
  const [isCopied, setIsCopied] = useState(false);
  const chat = useAtomValue(chatAtom);
  const selectedChatIndex = useAtomValue(selectedChatIndexAtom);

  // Get the selected message's SQL query (default to last if no selection)
  const effectiveIndex =
    selectedChatIndex !== null ? selectedChatIndex : chat.length - 1;
  const selectedMessage = chat[effectiveIndex];
  const sqlQuery = selectedMessage?.sql_query || "";

  const handleCopy = () => {
    if (!sqlQuery) return;
    navigator.clipboard.writeText(sqlQuery).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!sqlQuery) {
    return (
      <Flex className="flex-1 items-center justify-center">
        <CustomText stylearr={[14, 20, 500]} color="#9CA3AF">
          No SQL query generated yet
        </CustomText>
      </Flex>
    );
  }

  return (
    <Flex className="flex-col h-full w-full">
      <Flex className="h-[56px] w-full py-3 px-5 justify-between items-center flex-shrink-0">
        <CustomText stylearr={[14, 20, 600]} color="#111827">
          Generated SQL
        </CustomText>
        <MotionFlex
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={`cursor-pointer px-4 py-2 gap-2 items-center border ${
            isCopied
              ? "border-green-500 bg-green-50"
              : "border-[#E4E7EC] bg-[#FCFCFD]"
          } rounded-md`}
        >
          {isCopied ? (
            <>
              <Tick fontSize="16px" color="green" />
              <CustomText stylearr={[12, 18, 500]} color="green.500">
                Copied!
              </CustomText>
            </>
          ) : (
            <>
              <Copy fontSize="16px" color="#6B7280" />
              <CustomText stylearr={[12, 18, 500]} color="#6B7280">
                Copy
              </CustomText>
            </>
          )}
        </MotionFlex>
      </Flex>
      <Divider borderColor="#E4E7EC" />
      <Flex className="flex-1 overflow-auto bg-[#1d1f21] rounded-b-lg">
        <SyntaxHighlighterComponent
          language="sql"
          style={tomorrow as Record<string, unknown>}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: "14px",
            lineHeight: "1.6",
            width: "100%",
          }}
        >
          {sqlQuery}
        </SyntaxHighlighterComponent>
      </Flex>
    </Flex>
  );
}

