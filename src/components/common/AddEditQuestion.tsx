import {
  Box,
  chakra,
  Flex,
  HStack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Pencil as PencilOutline, Trash } from "react-huge-icons/outline";
import { PlusThin } from "react-huge-icons/solid";
import { IoIosCheckmark } from "react-icons/io";
import {
  IOption,
  IQuestions,
} from "../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import CustomCheckbox from "../CustomCheckbox";
import { systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomButton from "../DesignSystem/CustomButton";
import useCreateQuestion from "./Assesment/hooks/useCreateQuestion";
import useDeleteOption from "./Assesment/hooks/useDeleteOption";
import useUpdateQuestion, {
  UPDATE_QUESTION_PAYLOAD,
} from "./Assesment/hooks/useUpdateQuestion";
import CustomInput from "./CustomInput";

interface AddEditQuestionProps {
  questions: IQuestions[];
  setQuestions: (questions: IQuestions[]) => void;
  assessmentId?: string;
  editId?: string;
  setEditId?: Function;
}

const AddEditQuestion: React.FC<AddEditQuestionProps> = ({
  questions,
  setQuestions,
  assessmentId = "",
  editId = "",
  setEditId = () => {},
}) => {
  const { mutate: deleteMutate } = useDeleteOption();
  const editMode = Boolean(editId);
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateQuestion();

  const { mutate: createMutate, isLoading: isCreateLoading } =
    useCreateQuestion();

  // Infinite scrolling state
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMoreQuestions = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 5, questions.length));
  }, [questions.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < questions.length) {
          loadMoreQuestions();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreQuestions, visibleCount, questions.length]);

  // Reset visible count when questions array changes significantly
  useEffect(() => {
    setVisibleCount(Math.min(5, questions.length));
  }, [questions.length]);

  const updateQuestion = (index: number, updates: Partial<IQuestions>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const handleQuestionUpdate = (value: string, index: number) => {
    updateQuestion(index, { question: value });
  };

  const handleOptionUpdate = (options: IOption[], index: number) => {
    updateQuestion(index, { options });
  };

  const handleCorrectAnswerUpdate = (optionValue: string, index: number) => {
    updateQuestion(index, { correctedAnswer: optionValue });
  };

  const [deleteId, setDeleteId] = useState<string>("");

  const handleDeleteQuestion = (index: number) => {
    const question = questions[index];
    setDeleteId(question.id);
    updateMutate(
      {
        question_text: question.question,
        id: question.id,
        is_deleted: true,
      },
      {
        onSuccess() {
          setDeleteId("");
        },
      }
    );
  };

  const handleAddQuestion = (index: number) => {
    const newQuestion: IQuestions = {
      question: "",
      options: [{ label: "", value: new Date().toISOString() }],
      id: new Date().toISOString(),
      correctedAnswer: "",
      type: "new",
    };
    setEditId(newQuestion.id);
    setQuestions([
      ...questions.slice(0, index + 1),
      newQuestion,
      ...questions.slice(index + 1),
    ]);
  };

  const handleOptionChange = (
    optionIndex: number,
    value: string,
    question: IQuestions,
    index: number
  ) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === optionIndex ? { ...opt, label: value } : opt
    );
    handleOptionUpdate(updatedOptions, index);
  };

  const handleAddOption = (question: IQuestions, index: number) => {
    const newOption = {
      label: "",
      value: new Date().toISOString(),
      type: "new",
    };
    handleOptionUpdate([...question.options, newOption], index);
  };

  const handleDeleteOption = (
    optionValue: string,
    question: IQuestions,
    index: number
  ) => {
    if (question.options.length <= 2) return;
    const updatedOptions = question.options.filter(
      (opt) => opt.value !== optionValue
    );
    handleOptionUpdate(updatedOptions, index);
    if (question.correctedAnswer === optionValue) {
      handleCorrectAnswerUpdate("", index);
    }
  };

  const isSaveDisabled = (row: IQuestions) => {
    if (!editMode) return false;
    if (editId !== row.id) return true;
    else {
      return !(
        row.question &&
        row.options.length !== 0 &&
        row.options.every((str) => str.label.trim().length > 0) &&
        row.correctedAnswer
      );
    }
  };

  const buttonConfig = [
    {
      label: editMode ? "Save" : "Edit",
      icon: editMode ? (
        <IoIosCheckmark fontSize="34px" />
      ) : (
        <PencilOutline fontSize="24px" />
      ),
      onClick: (index: number, question: IQuestions) => {
        if (editMode) {
          const options = question.options.map((row) => {
            return {
              id: row?.type ? null : row.value,
              option_text: row.label,
              is_correct: row.value === question.correctedAnswer,
              is_deleted: false,
            };
          });
          if (question?.type === "new") {
            createMutate(
              {
                question_text: question.question,
                options: options,
                assessment_id: assessmentId,
              },
              {
                onSuccess() {
                  setEditId(editMode ? "" : questions[index].id);
                },
              }
            );
          } else {
            const payload: UPDATE_QUESTION_PAYLOAD = {
              question_text: question.question,
              id: question.id,
              options,
            };
            updateMutate(payload, {
              onSuccess() {
                setEditId(editMode ? "" : questions[index].id);
              },
            });
          }
        } else {
          setEditId(editMode ? "" : questions[index].id);
        }
      },
      isLoading: (row: IQuestions) =>
        (isUpdateLoading || isCreateLoading) && editId === row.id,
      isDisabled: (row: IQuestions) => isSaveDisabled(row),
    },
    {
      label: "Delete",
      icon: <Trash fontSize="24px" />,
      onClick: handleDeleteQuestion,
      isDisabled: () => editMode || questions.length <= 1,
      isLoading: (question: IQuestions) =>
        deleteId === question.id && isUpdateLoading,
    },
    // {
    //   label: "Duplicate",
    //   icon: <Copy fontSize="24px" />,
    //   onClick: (index: number, questions: IQuestions) => {
    //     handleDuplicateQuestion(index, questions);
    //   },
    //   isDisabled: () => editMode,
    // },
    {
      label: "Add more question",
      icon: <PlusThin fontSize="24px" />,
      onClick: handleAddQuestion,
      isDisabled: () => editMode,
    },
  ];
  return (
    <>
      {questions.slice(0, visibleCount).map((question, index) => {
        return (
          <HStack
            key={question.id}
            p={6}
            bgColor={systemColors.white.absolute}
            borderLeftWidth="4px"
            borderColor={systemColors.black[900]}
            borderRadius="16px"
            gap={6}
            alignItems="center"
            justifyContent="center"
            w="full"
            divider={<StackDivider borderColor={systemColors.black[200]} />}
          >
            <Flex flexDir="column" gap={6} flexGrow={1}>
              <Flex flexDirection="column" gap={3}>
                <Text>
                  {index + 1}- Question
                  <chakra.span ml="2px" color={systemColors.error[700]}>
                    *
                  </chakra.span>
                </Text>
                <CustomInput
                  h="56px"
                  isDisabled={!editMode}
                  value={question.question}
                  onInput={(e) =>
                    handleQuestionUpdate(e.currentTarget.value, index)
                  }
                  placeholder="What's your name"
                />
              </Flex>

              <Flex flexDirection="column" gap={3}>
                <Text>
                  Options
                  <chakra.span ml="2px" color={systemColors.error[700]}>
                    *
                  </chakra.span>
                </Text>
                {question?.options?.map((option, id) => (
                  <Flex key={option.value} gap={6}>
                    <HStack
                      borderRadius="10px"
                      borderWidth="1px"
                      p="16px 20px"
                      borderColor={systemColors.grey[200]}
                      flexGrow={1}
                      divider={
                        <StackDivider borderColor={systemColors.black[200]} />
                      }
                    >
                      <CustomInput
                        value={option.label}
                        border="none"
                        _focusVisible={{ border: "none" }}
                        height="auto"
                        p={0}
                        isDisabled={!editMode}
                        onChange={(e) =>
                          handleOptionChange(
                            id,
                            e.target.value,
                            question,
                            index
                          )
                        }
                        placeholder={`Option ${id + 1}`}
                      />
                      <Trash
                        opacity={
                          editMode && question.options.length > 2 ? 1 : 0.5
                        }
                        cursor={editMode ? "pointer" : "not-allowed"}
                        fontSize="20px"
                        onClick={() => {
                          if (editMode) {
                            if (question.type === "new") {
                              handleDeleteOption(option.value, question, index);
                            } else {
                              deleteMutate({
                                optionId: option.value,
                                questionId: question.id,
                              });
                            }
                          }
                        }}
                      />
                    </HStack>
                    <CustomCheckbox
                      setIsChecked={() =>
                        editMode &&
                        handleCorrectAnswerUpdate(option.value, index)
                      }
                      cursor={editMode ? "pointer" : "not-allowed"}
                      fontWeight="400"
                      label="Select Correct Option"
                      isChecked={question.correctedAnswer === option.value}
                    />
                  </Flex>
                ))}
                {question.options.length < 5 &&
                  editMode &&
                  editId === question.id && (
                    <Flex gap={6}>
                      <CustomButton
                        color={systemColors.black[600]}
                        fontWeight={500}
                        justifyContent="flex-start"
                        variant="tertiary"
                        w="auto"
                        flexGrow={1}
                        h="56px"
                        borderColor={systemColors.grey[200]}
                        leftIcon={<PlusThin fontSize="24px" />}
                        onClick={() => handleAddOption(question, index)}
                      >
                        More Option
                      </CustomButton>
                      <Box visibility="hidden">
                        <CustomCheckbox
                          isChecked
                          label="Select Correct Option"
                        />
                      </Box>
                    </Flex>
                  )}
              </Flex>
            </Flex>

            <Flex flexDirection="column" gap={5}>
              {buttonConfig.map((button, idx) => (
                <CustomButton
                  key={idx}
                  px={6}
                  h="40px"
                  justifyContent={
                    button?.isLoading?.(question) ? "center" : "flex-start"
                  }
                  variant="tertiary"
                  isLoading={
                    (button?.isLoading && button.isLoading(question)) || false
                  }
                  leftIcon={button.icon}
                  onClick={() => button.onClick(index, question)}
                  isDisabled={button.isDisabled(question)}
                >
                  {button.label}
                </CustomButton>
              ))}
            </Flex>
          </HStack>
        );
      })}
      {visibleCount < questions.length && (
        <Box ref={loadMoreRef} h="20px" w="full" my={4}></Box>
      )}
    </>
  );
};

export default AddEditQuestion;
