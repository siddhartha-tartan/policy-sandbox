import { AddIcon } from "@chakra-ui/icons";
import { AbsoluteCenter, Box, Divider, Flex, Image } from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Pencil } from "react-huge-icons/outline";
import { MdOutlineFileUpload } from "react-icons/md";
import AiFill from "../../../../assets/Icons/ai-fill.png";
import AiOutline from "../../../../assets/Icons/ai-outline.png";
import AddEditQuestion from "../../../../components/common/AddEditQuestion";
import FileSelector from "../../../../components/common/FileSelector";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import EventBus from "../../../../EventBus";
import { userStore } from "../../../../store/userStore";
import { FeatureIdentifiers } from "../../../../utils/constants/constants";
import {
  assesmentDataAtom,
  bulkUploadQuestionsAtom,
  bulkUploadType,
  fileErrorAtom,
} from "../atom";
import { EVENT_OPEN_GENERATE_QUESTIONS } from "../pages/AddAssesment/components/AiGenerateQuestionsModal";
import { IQuestions } from "../pages/IndivisualAssesment/hooks/useGetAssesment";
import { parseCsvQuestions, validateQuestionRow } from "../utils/helpers";
import PreviewAssesmentFile from "./PreviewAssesmentFile";

export default function QuestionnaireTab() {
  const assesmentData = useAtomValue(assesmentDataAtom);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [editId, setEditId] = useState<string>("");
  const setError = useSetAtom(fileErrorAtom);
  const [bulkQuestions, setBulkQuestions] = useAtom(bulkUploadQuestionsAtom);
  const [uploadType, setUploadType] = useAtom(bulkUploadType);
  const { enabledFeature } = userStore();
  const isAssessmentAiEnabled = enabledFeature.includes(
    FeatureIdentifiers.AI_ASSESSMENT
  );

  useEffect(() => {
    if (
      assesmentData?.questions?.length &&
      assesmentData?.questions?.length > 0
    ) {
      setQuestions(assesmentData?.questions);
      setEditId("");
    } else {
      const queId = "question-temp-1";
      setQuestions([
        {
          question: "",
          options: [
            { label: "", value: `${new Date().toISOString()} - 1` },
            { label: "", value: `${new Date().toISOString()} - 2` },
          ],
          id: queId,
          correctedAnswer: "",
          type: "new",
        },
      ]);
      setEditId(queId);
    }
  }, [assesmentData]);

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      setBulkQuestions([]);
      return;
    }
    try {
      const questions = await parseCsvQuestions(file);
      setBulkQuestions(questions);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  };

  if (!assesmentData || questions?.length == 0) return null;

  const renderContent = () => {
    switch (uploadType) {
      case "csv":
        return (
          <FileSelector
            acceptedFileTypes={".csv"}
            maxFileSizeMB={20}
            onFileSelect={handleFileSelect}
            onError={setError}
            requiredHeaders={[
              "Question Mandatory",
              "Option A Mandatory",
              "Option B Mandatory",
              "Correct answer Mandatory(Only Add `A` `B` `C` `D`)",
            ]}
            sampleFileUrl="/assesment_sample.csv"
            sampleFileName="Sample CSV file"
            labels={{
              sampleFile: "Sample CSV file",
            }}
            validateRow={validateQuestionRow}
          />
        );
      case "manual":
        return (
          <AddEditQuestion
            questions={questions}
            setQuestions={setQuestions}
            assessmentId={assesmentData?.id}
            editId={editId}
            setEditId={setEditId}
          />
        );

      default:
        return (
          <Flex flexDir={"column"} w={"full"} gap={"32px"}>
            {isAssessmentAiEnabled && (
              <>
                {" "}
                <Flex
                  className="flex-row justify-between p-5 rounded-[8px]"
                  background={
                    " linear-gradient(180deg, #3A4FBF 0%, #1B2559 100%)"
                  }
                >
                  <Flex className="flex-row gap-6 items-center">
                    <Image
                      className="w-12 h-12 p-2 rounded-[8px]"
                      src={AiFill}
                      background={
                        " linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%)"
                      }
                    />
                    <CustomText stylearr={[20, 24, 700]} color={"#FFF"}>
                      Create Assessment with AI
                    </CustomText>
                  </Flex>
                  <CustomButton
                    style={{
                      background: systemColors.white.absolute,
                      color: "#3762DD",
                    }}
                    fontWeight={600}
                    w={"170px"}
                    rightIcon={<Image src={AiOutline} className="w-5 h-5" />}
                    onClick={() => {
                      setUploadType("ai");
                      EventBus.getInstance().fireEvent(
                        EVENT_OPEN_GENERATE_QUESTIONS
                      );
                    }}
                  >
                    Create
                  </CustomButton>
                </Flex>
                <Box position="relative">
                  <Divider />
                  <AbsoluteCenter bg={"white"} px={4}>
                    <CustomText stylearr={[16, 24, 800]}>Or</CustomText>
                  </AbsoluteCenter>
                </Box>
              </>
            )}

            <Flex className="flex-row gap-4">
              <CustomButton
                variant="tertiary"
                className="w-1/2 font-semibold text-sm items-center"
                color={"#1B2559"}
                leftIcon={<MdOutlineFileUpload fontSize={"20px"} />}
                onClick={() => {
                  setUploadType("csv");
                }}
              >
                CSV Upload File
              </CustomButton>
              <CustomButton
                variant="tertiary"
                className="w-1/2 font-semibold text-sm items-center"
                color={"#1B2559"}
                leftIcon={
                  assesmentData?.questions?.length ? (
                    <Pencil fontSize={"18px"} />
                  ) : (
                    <AddIcon fontSize={"14px"} />
                  )
                }
                onClick={() => setUploadType("manual")}
              >
                {assesmentData?.questions?.length ? "Edit " : "Add "}
                Questions Manually
              </CustomButton>
            </Flex>
          </Flex>
        );
    }
  };

  return bulkQuestions?.length ? (
    <PreviewAssesmentFile />
  ) : (
    <Flex flexDir={"column"} w={"full"} gap={"24px"}>
      {renderContent()}
    </Flex>
  );
}
