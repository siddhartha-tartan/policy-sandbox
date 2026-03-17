import { Box, Divider, Flex, Select } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Copy, Tick } from "react-huge-icons/outline";
import { BiCollapse, BiExpand } from "react-icons/bi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import usePolicyGenPolling from "../../../hooks/usePolicyGenPolling";
import useGenerateCode, { CodeLanguage } from "../hooks/useGenerateCode";
import {
  codeRequestIdAtom,
  generatedCodeAtom,
  isFullScreenAtom,
} from "../threadAtom";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);
const SyntaxHighlighterComponent =
  SyntaxHighlighter as unknown as React.FC<any>;

export default function CodeView() {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(
    CodeLanguage.DROOLS
  );
  const [code, setCode] = useAtom(generatedCodeAtom);
  const requestId = useAtomValue(codeRequestIdAtom);
  const htmlString = code || "";
  const { mutate: startPolling } = usePolicyGenPolling();
  const { mutate: generateCode, isLoading: isGenerating } = useGenerateCode();

  useEffect(() => {
    if (!code && requestId) {
      startPolling(
        { requestId: requestId },
        {
          onSuccess(successData) {
            setCode(successData?.response!);
          },
        }
      );
    }
  }, [code, requestId]);

  const handleCopy = () => {
    // Add your copy-to-clipboard logic here
    navigator.clipboard.writeText(code || "").then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value as CodeLanguage;
    setSelectedLanguage(newLanguage);
    setCode(""); // Clear existing code
    generateCode({ codeLanguage: newLanguage });
  };

  const getLanguageDisplayName = (language: CodeLanguage): string => {
    const languageMap = {
      [CodeLanguage.DROOLS]: "Drools",
      [CodeLanguage.PYTHON]: "Python",
      [CodeLanguage.JSONATA]: "JSONata",
      [CodeLanguage.JAVA]: "Java",
    };
    return languageMap[language];
  };

  const [isFullScreen, setIsFullScreen] = useAtom(isFullScreenAtom);

  return (
    <div className="flex flex-col gap-1 w-full h-full overflow-y-auto">
      <MotionBox
        className={`flex ${
          isFullScreen ? "" : "rounded-[16px] border-[1px] border-[#E4E7EC]"
        } flex-col bg-[#F8F9FA]  w-full h-full transition-all overflow-y-auto`}
      >
        <Flex className="flex h-[56px] w-full py-[12px] px-5 justify-between items-center">
          <Flex className="gap-4 items-center">
            <CustomText stylearr={[12, 18, 500]}>Code</CustomText>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              size="sm"
              width="120px"
              bg="white"
              border="1px solid #E4E7EC"
              borderRadius="6px"
              isDisabled={isGenerating}
            >
              {Object.values(CodeLanguage).map((language) => (
                <option key={language} value={language}>
                  {getLanguageDisplayName(language)}
                </option>
              ))}
            </Select>
          </Flex>
          <Flex className="gap-4 items-center">
            {isFullScreen ? (
              <>
                <MotionFlex
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullScreen(false)}
                  className={`cursor-pointer px-4 py-2 gap-1 items-center border-[1px] ${
                    isCopied
                      ? "border-green-500 bg-green-100"
                      : "border-[#E4E7EC] bg-[#FCFCFD]"
                  } rounded-[6px]`}
                >
                  <BiCollapse fontSize={"16px"} />
                  <CustomText stylearr={[12, 18, 500]}>Collapse</CustomText>
                </MotionFlex>
              </>
            ) : (
              <MotionFlex
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullScreen(true)}
                className={`cursor-pointer px-4 py-2 gap-1 items-center border-[1px] ${
                  isCopied
                    ? "border-green-500 bg-green-100"
                    : "border-[#E4E7EC] bg-[#FCFCFD]"
                } rounded-[6px]`}
              >
                <BiExpand fontSize={"16px"} />
                <CustomText stylearr={[12, 18, 500]}>Expand</CustomText>
              </MotionFlex>
            )}
            {htmlString && (
              <MotionFlex
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`cursor-pointer px-4 py-2 gap-1 items-center border-[1px] ${
                  isCopied
                    ? "border-green-500 bg-green-100"
                    : "border-[#E4E7EC] bg-[#FCFCFD]"
                } rounded-[6px]`}
              >
                {isCopied ? (
                  <>
                    <CustomText stylearr={[12, 18, 500]} color="green.500">
                      Copied!
                    </CustomText>
                    <Tick fontSize={"16px"} color="green" />
                  </>
                ) : (
                  <>
                    <CustomText stylearr={[12, 18, 500]}>Copy</CustomText>
                    <Copy fontSize={"16px"} />
                  </>
                )}
              </MotionFlex>
            )}
          </Flex>
        </Flex>
        <Divider bgColor={"#E4E7EC"} />

        <Flex className="overflow-y-auto py-1 w-full bg-[#2d2d2d]">
          {!htmlString && !isGenerating ? (
            <Flex className="w-full h-full items-center justify-center flex-col gap-4 py-20">
              {/* <CustomText stylearr={[16, 24, 500]} color="#9CA3AF">
                No code generated yet
              </CustomText>
              <CustomText
                stylearr={[14, 20, 400]}
                color="#6B7280"
                className="text-center"
              >
                Select a language and generate code to see the output here
              </CustomText> */}
            </Flex>
          ) : !htmlString && isGenerating ? (
            <>
              <div className="w-full flex-col gap-6 flex"></div>
            </>
          ) : (
            <SyntaxHighlighterComponent
              language={selectedLanguage}
              style={tomorrow as any}
              customStyle={{ width: "100%" }}
            >
              {htmlString.replace(/```\w+/g, "").replace(/```/g, "")}
            </SyntaxHighlighterComponent>
          )}
        </Flex>
      </MotionBox>
      <CustomText stylearr={[13, 20, 500]}>
        <span style={{ fontWeight: 500 }}>Note: </span>
        On Sandbox, the code accuracy for new policies may be lower than
        expected. Model training and fine-tuning will be carried out before
        deploying to production.
      </CustomText>
    </div>
  );
}
