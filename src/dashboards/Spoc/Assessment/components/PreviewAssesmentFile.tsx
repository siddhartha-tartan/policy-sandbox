import { Flex } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { Trash } from "react-huge-icons/outline";
import CustomCheckbox from "../../../../components/CustomCheckbox";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import CustomTable from "../../../../components/common/CustomTable";
import {
  AiGenerateQuestionStateAtom,
  bulkUploadQuestionsAtom,
  bulkUploadType,
} from "../atom";
import { IQuestions } from "../pages/IndivisualAssesment/hooks/useGetAssesment";
import GradientText from "../../../../components/common/GradientText/GradientText";
import useGenerateAiQuestions from "../pages/AddAssesment/hooks/useGenerateAiQuestions";

export default function PreviewAssessmentFile() {
  const uploadType = useAtomValue(bulkUploadType);
  const [bulkQuestions, setBulkQuestions] = useAtom(bulkUploadQuestionsAtom);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set<string>()
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [unSelectedRowIds, setUnSelectedRowIds] = useState<Set<string>>(
    new Set<string>()
  );
  const [aiRegeneratedQuestionIds, setAiRegeneratedQuestionIds] = useState<
    Set<string>
  >(new Set<string>());
  const { mutate, isLoading: isGenerateAiQuestionsLoading } =
    useGenerateAiQuestions(() => {
      // Get the actually selected questions based on selectAll state
      const selected = selectAll
        ? bulkQuestions.filter((q) => !unSelectedRowIds.has(q.id))
        : bulkQuestions.filter((q) => selectedRowIds.has(q.id));

      setAiRegeneratedQuestionIds(new Set(selected.map((q) => q.id)));
      setSelectedRowIds(new Set());
      setSelectAll(false);
      setUnSelectedRowIds(new Set());
    });
  const aiGenerateQuestionsState = useAtomValue(AiGenerateQuestionStateAtom);
  const isHeaderDeleteDisabled = selectAll
    ? unSelectedRowIds?.size === bulkQuestions?.length
    : !selectedRowIds?.size;

  const handleBulkDelete = () => {
    if (isHeaderDeleteDisabled) return;

    if (selectAll) {
      setBulkQuestions((prev) =>
        prev.filter((question) => unSelectedRowIds.has(question.id))
      );
    } else {
      setBulkQuestions((prev) =>
        prev.filter((question) => !selectedRowIds.has(question.id))
      );
    }
  };

  const handleSingleDelete = (questionId: string) => {
    setBulkQuestions((prev) =>
      prev.filter((question) => question.id !== questionId)
    );
  };

  // Helper function to get actually selected questions based on selectAll state
  const getSelectedQuestions = () => {
    if (selectAll) {
      return bulkQuestions.filter(
        (question) => !unSelectedRowIds.has(question.id)
      );
    } else {
      return bulkQuestions.filter((question) =>
        selectedRowIds.has(question.id)
      );
    }
  };

  // Helper function to get not selected questions based on selectAll state
  const getNotSelectedQuestions = () => {
    if (selectAll) {
      return bulkQuestions.filter((question) =>
        unSelectedRowIds.has(question.id)
      );
    } else {
      return bulkQuestions.filter(
        (question) => !selectedRowIds.has(question.id)
      );
    }
  };

  const columns: ColumnDef<IQuestions>[] = [
    {
      id: "selection",
      header: ({ table }) => (
        <CustomCheckbox
          isChecked={table.getIsAllRowsSelected()}
          setIsChecked={(e) => table.getToggleAllRowsSelectedHandler()(e)}
        />
      ),
      cell: ({ row }) => (
        <CustomCheckbox
          isChecked={row.getIsSelected()}
          //@ts-ignore
          setIsChecked={(e) => row.getToggleRowSelectedHandler()(e)}
        />
      ),
      size: 1,
    },
    {
      accessorKey: "Questions",
      header: "Questions",
      size: 200,
      cell: ({ row }) => {
        const isAiRegenerated = aiRegeneratedQuestionIds.has(row.original.id);
        return (
          <Flex className="flex flex-row gap-2 flex-1 items-center">
            {isAiRegenerated && (
              <div className="flex w-4 h-4">
                {" "}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.00191 6.375C9.00286 6.5279 8.9564 6.67733 8.86893 6.80274C8.78146 6.92816 8.65728 7.02338 8.51347 7.07531L6.09566 7.96875L5.20503 10.3884C5.15229 10.5317 5.05687 10.6554 4.93164 10.7427C4.80641 10.8301 4.6574 10.8769 4.50472 10.8769C4.35204 10.8769 4.20303 10.8301 4.0778 10.7427C3.95257 10.6554 3.85715 10.5317 3.80441 10.3884L2.90816 7.96875L0.488468 7.07812C0.345185 7.02538 0.221527 6.92996 0.13418 6.80473C0.0468331 6.6795 0 6.53049 0 6.37781C0 6.22513 0.0468331 6.07612 0.13418 5.95089C0.221527 5.82566 0.345185 5.73024 0.488468 5.6775L2.90816 4.78125L3.79878 2.36156C3.85152 2.21828 3.94695 2.09462 4.07217 2.00727C4.1974 1.91993 4.34641 1.87309 4.49909 1.87309C4.65178 1.87309 4.80078 1.91993 4.92601 2.00727C5.05124 2.09462 5.14666 2.21828 5.19941 2.36156L6.09566 4.78125L8.51534 5.67188C8.65926 5.72428 8.78336 5.82006 8.87051 5.94601C8.95767 6.07195 9.00358 6.22185 9.00191 6.375ZM6.37691 1.875H7.12691V2.625C7.12691 2.72446 7.16641 2.81984 7.23674 2.89016C7.30707 2.96049 7.40245 3 7.50191 3C7.60136 3 7.69674 2.96049 7.76707 2.89016C7.8374 2.81984 7.87691 2.72446 7.87691 2.625V1.875H8.62691C8.72636 1.875 8.82174 1.83549 8.89207 1.76516C8.9624 1.69484 9.00191 1.59946 9.00191 1.5C9.00191 1.40054 8.9624 1.30516 8.89207 1.23484C8.82174 1.16451 8.72636 1.125 8.62691 1.125H7.87691V0.375C7.87691 0.275544 7.8374 0.180161 7.76707 0.109835C7.69674 0.0395088 7.60136 0 7.50191 0C7.40245 0 7.30707 0.0395088 7.23674 0.109835C7.16641 0.180161 7.12691 0.275544 7.12691 0.375V1.125H6.37691C6.27745 1.125 6.18207 1.16451 6.11174 1.23484C6.04141 1.30516 6.00191 1.40054 6.00191 1.5C6.00191 1.59946 6.04141 1.69484 6.11174 1.76516C6.18207 1.83549 6.27745 1.875 6.37691 1.875ZM10.5019 3.375H10.1269V3C10.1269 2.90054 10.0874 2.80516 10.0171 2.73484C9.94674 2.66451 9.85136 2.625 9.75191 2.625C9.65245 2.625 9.55707 2.66451 9.48674 2.73484C9.41641 2.80516 9.37691 2.90054 9.37691 3V3.375H9.00191C8.90245 3.375 8.80707 3.41451 8.73674 3.48484C8.66641 3.55516 8.62691 3.65054 8.62691 3.75C8.62691 3.84946 8.66641 3.94484 8.73674 4.01516C8.80707 4.08549 8.90245 4.125 9.00191 4.125H9.37691V4.5C9.37691 4.59946 9.41641 4.69484 9.48674 4.76516C9.55707 4.83549 9.65245 4.875 9.75191 4.875C9.85136 4.875 9.94674 4.83549 10.0171 4.76516C10.0874 4.69484 10.1269 4.59946 10.1269 4.5V4.125H10.5019C10.6014 4.125 10.6967 4.08549 10.7671 4.01516C10.8374 3.94484 10.8769 3.84946 10.8769 3.75C10.8769 3.65054 10.8374 3.55516 10.7671 3.48484C10.6967 3.41451 10.6014 3.375 10.5019 3.375Z"
                    fill="url(#paint0_linear_4809_4151)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_4809_4151"
                      x1="-6.74733e-08"
                      y1="-1.51068"
                      x2="18.7447"
                      y2="0.165719"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#3762DD" />
                      <stop offset="1" stop-color="#1D3577" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}

            <CustomText stylearr={[14, 20, 500]} color={systemColors.grey[900]}>
              {row?.original?.question}
            </CustomText>
          </Flex>
        );
      },
    },
    {
      accessorKey: "Option A",
      header: "Option A",
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[14, 20, 500]} color={systemColors.grey[900]}>
            {row?.original?.options?.[0]?.label}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "Option B",
      header: "Option B",
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[14, 20, 500]} color={systemColors.grey[900]}>
            {row?.original?.options?.[1]?.label}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "Option C",
      header: "Option C",
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[14, 20, 500]} color={systemColors.grey[900]}>
            {row?.original?.options?.[2]?.label}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "Option D",
      header: "Option D",
      cell: ({ row }) => {
        return (
          <CustomText stylearr={[14, 20, 500]} color={systemColors.grey[900]}>
            {row?.original?.options?.[3]?.label}
          </CustomText>
        );
      },
    },
    {
      accessorKey: "Correct Answer",
      //@ts-ignore
      header: (
        <Flex className="justify-between items-center w-full">
          <CustomText
            stylearr={[12, 19, 700]}
            color={customColors.PALE_SKY}
            textTransform="capitalize"
            w="full"
          >
            Correct Option
          </CustomText>

          <Trash
            fontSize={"20px"}
            cursor={isHeaderDeleteDisabled ? "not-allowed" : "pointer"}
            opacity={isHeaderDeleteDisabled ? 0.2 : 1}
            onClick={handleBulkDelete}
          />
        </Flex>
      ),
      cell: ({ row }) => {
        return (
          <Flex className="justify-between items-center">
            <CustomText stylearr={[14, 20, 500]} color={systemColors.grey[900]}>
              {row?.original?.correctOption}
            </CustomText>
            <Trash
              fontSize={"17px"}
              cursor={"pointer"}
              onClick={() => handleSingleDelete(row.original.id)}
            />
          </Flex>
        );
      },
    },
  ];

  const handleRegenerate = () => {
    const selectedQuestions = getSelectedQuestions();
    const formattedQuestions = selectedQuestions?.map((item) => ({
      id: item?.id,
      questionText: item?.question,
      options: item?.options?.map((option) => ({
        label: option?.value,
        text: option?.label,
      })),
      correctAnswer: item?.correctOption,
    }));

    const notSelectedQuestions = getNotSelectedQuestions();
    const formattedNotSelectedQuestions = notSelectedQuestions?.map((item) => ({
      id: item?.id,
      questionText: item?.question,
      options: item?.options?.map((option) => ({
        label: option?.value,
        text: option?.label,
      })),
      correctAnswer: item?.correctOption,
    }));

    mutate(
      {
        ...aiGenerateQuestionsState,
        no_of_questions: bulkQuestions.length,
        selected: formattedQuestions,
        not_selected: formattedNotSelectedQuestions,
      },
      {
        onSuccess() {},
      }
    );
  };

  // Calculate highlighted row indices for regenerated questions
  const highlightedRowIndices = bulkQuestions
    .map((question, index) =>
      aiRegeneratedQuestionIds.has(question.id) ? index : -1
    )
    .filter((index) => index !== -1);

  return (
    <>
      <style>
        {`
          .ai-regenerated-row {
            background: linear-gradient(213.02deg, rgba(55, 98, 221, 0) 19.28%, rgba(55, 98, 221, 0.09) 79.88%) !important;
          }
        `}
      </style>
      <div className="flex flex-col w-full gap-4">
        {uploadType === "ai" && (
          <div className="flex flex-row gap-6 items-center">
            {" "}
            {/* <div
              className="flex flex-row w-full justify-end gap-1 items-center"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectAll(false);
                setSelectedRowIds(new Set());
                setUnSelectedRowIds(
                  new Set(bulkQuestions.map((question) => question.id))
                );
                mutate(
                  {
                    ...aiGenerateQuestionsState,
                    no_of_questions: bulkQuestions.length,
                    selected: [],
                    not_selected: bulkQuestions,
                  },
                  {
                    onSuccess() {},
                  }
                );
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 8C14 8.13261 13.9473 8.25979 13.8536 8.35355C13.7598 8.44732 13.6326 8.5 13.5 8.5H8.5V13.5C8.5 13.6326 8.44732 13.7598 8.35355 13.8536C8.25979 13.9473 8.13261 14 8 14C7.86739 14 7.74021 13.9473 7.64645 13.8536C7.55268 13.7598 7.5 13.6326 7.5 13.5V8.5H2.5C2.36739 8.5 2.24021 8.44732 2.14645 8.35355C2.05268 8.25979 2 8.13261 2 8C2 7.86739 2.05268 7.74021 2.14645 7.64645C2.24021 7.55268 2.36739 7.5 2.5 7.5H7.5V2.5C7.5 2.36739 7.55268 2.24021 7.64645 2.14645C7.74021 2.05268 7.86739 2 8 2C8.13261 2 8.25979 2.05268 8.35355 2.14645C8.44732 2.24021 8.5 2.36739 8.5 2.5V7.5H13.5C13.6326 7.5 13.7598 7.55268 13.8536 7.64645C13.9473 7.74021 14 7.86739 14 8Z"
                  fill="url(#paint0_linear_4805_2854)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_4805_2854"
                    x1="2"
                    y1="0.333334"
                    x2="22.6802"
                    y2="2.18283"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#3762DD" />
                    <stop offset="1" stop-color="#1D3577" />
                  </linearGradient>
                </defs>
              </svg>

              <GradientText
                text={"Add More Questions"}
                gradient={
                  "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                }
                className="text-sm "
              />
            </div> */}
            <div
              className="flex flex-row w-full justify-end gap-1 items-center"
              style={{
                cursor: isHeaderDeleteDisabled ? "not-allowed" : "pointer",
                opacity: isHeaderDeleteDisabled ? 0.4 : 1,
              }}
              onClick={
                isHeaderDeleteDisabled || isGenerateAiQuestionsLoading
                  ? () => {}
                  : () => handleRegenerate()
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 6.49986H2.5C2.36739 6.49986 2.24021 6.44719 2.14645 6.35342C2.05268 6.25965 2 6.13247 2 5.99986V2.99986C2 2.86726 2.05268 2.74008 2.14645 2.64631C2.24021 2.55254 2.36739 2.49986 2.5 2.49986C2.63261 2.49986 2.75979 2.55254 2.85355 2.64631C2.94732 2.74008 3 2.86726 3 2.99986V4.79299L3.91438 3.87861C5.02951 2.75787 6.544 2.12573 8.125 2.12111H8.15812C9.72568 2.11708 11.2317 2.73076 12.35 3.82924C12.4413 3.92265 12.4924 4.04809 12.4924 4.17872C12.4925 4.30934 12.4413 4.43479 12.35 4.52821C12.2587 4.62163 12.1345 4.67562 12.0039 4.67861C11.8733 4.68161 11.7467 4.63338 11.6512 4.54424C10.7191 3.62929 9.46427 3.11805 8.15812 3.12111H8.13C6.81261 3.12517 5.55067 3.65184 4.62125 4.58549L3.70688 5.49986H5.5C5.63261 5.49986 5.75979 5.55254 5.85355 5.64631C5.94732 5.74008 6 5.86726 6 5.99986C6 6.13247 5.94732 6.25965 5.85355 6.35342C5.75979 6.44719 5.63261 6.49986 5.5 6.49986ZM13.5 9.49986H10.5C10.3674 9.49986 10.2402 9.55254 10.1464 9.64631C10.0527 9.74008 10 9.86726 10 9.99986C10 10.1325 10.0527 10.2596 10.1464 10.3534C10.2402 10.4472 10.3674 10.4999 10.5 10.4999H12.2931L11.3787 11.4142C10.4495 12.3477 9.1878 12.8744 7.87063 12.8786H7.8425C6.53636 12.8817 5.28151 12.3704 4.34937 11.4555C4.3028 11.4078 4.24718 11.37 4.18578 11.3441C4.12437 11.3183 4.05842 11.305 3.99179 11.305C3.92517 11.305 3.85922 11.3183 3.79781 11.3442C3.73641 11.37 3.68079 11.4079 3.63423 11.4555C3.58766 11.5032 3.55109 11.5596 3.52665 11.6216C3.50222 11.6836 3.49042 11.7499 3.49195 11.8165C3.49348 11.8831 3.5083 11.9487 3.53555 12.0095C3.5628 12.0703 3.60192 12.125 3.65062 12.1705C4.76892 13.269 6.27495 13.8827 7.8425 13.8786H7.875C9.45579 13.8738 10.97 13.2417 12.085 12.1211L13 11.2067V12.9999C13 13.1325 13.0527 13.2596 13.1464 13.3534C13.2402 13.4472 13.3674 13.4999 13.5 13.4999C13.6326 13.4999 13.7598 13.4472 13.8536 13.3534C13.9473 13.2596 14 13.1325 14 12.9999V9.99986C14 9.86726 13.9473 9.74008 13.8536 9.64631C13.7598 9.55254 13.6326 9.49986 13.5 9.49986Z"
                  fill="url(#paint0_linear_4805_3362)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_4805_3362"
                    x1="2"
                    y1="0.488103"
                    x2="22.6734"
                    y2="2.37512"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#3762DD" />
                    <stop offset="1" stop-color="#1D3577" />
                  </linearGradient>
                </defs>
              </svg>
              <GradientText
                text={"Regenerate Selected Questions"}
                gradient={
                  "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                }
                className="text-sm "
              />
            </div>
          </div>
        )}

        <CustomTable
          data={bulkQuestions}
          columns={columns}
          selectedRows={selectedRowIds}
          setSelectedRows={setSelectedRowIds}
          selectAll={selectAll}
          setSelectAll={setSelectAll}
          unSelectedRows={unSelectedRowIds}
          setUnSelectedRows={setUnSelectedRowIds}
          lastAlignRight={false}
          highlightedRows={highlightedRowIndices}
          highlightedRowClass="ai-regenerated-row"
        />
      </div>
    </>
  );
}
