import { ChevronRightIcon } from "@chakra-ui/icons";
import { Divider, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { format } from "date-fns";
import { Provider, useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { systemColors } from "../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../components/DesignSystem/Typography/CustomText";
import useAddUsersAssesment from "../../../../../components/common/Assesment/hooks/useAddUsersAssesment";
import useCreateAssesment from "../../../../../components/common/Assesment/hooks/useCreateAssesment";
import useUpdateAssesment from "../../../../../components/common/Assesment/hooks/useUpdateAssesment";
import CustomStepper from "../../../../../components/common/CustomStepper";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { isEmptyObject } from "../../../../../utils/common/isEmptyObject";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import {
  assesmentDataAtom,
  bulkUploadQuestionsAtom,
  bulkUploadType,
  emailsAtom,
  errorAtom,
  fileErrorAtom,
  selectAllAtom,
  selectedRowIdsAtom,
  unSelectedRowIdsAtom,
} from "../../atom";
import AssignmentScheduledModal from "../../components/AssignmentScheduledModal";
import DetailsTab from "../../components/DetailsTab";
import QuestionnaireTab from "../../components/QuestionnaireTab";
import UserSelected from "../../components/UserSelected";
import useAddBulkAssessment from "../IndivisualAssesment/hooks/useAddBulkAssesment";
import useGetAssesment from "../IndivisualAssesment/hooks/useGetAssesment";
import AiGenerateQuestionsModal from "./components/AiGenerateQuestionsModal";
import GenerateQuestionsProcessingModal from "./components/GenerateQuestionsPollingModal";

function AddAssesmentProvider() {
  const { id } = useParams();
  const userType = useGetUserType();
  const { data, isLoading } = useGetAssesment();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const { mutate: userMappingMutate, isLoading: isUserMappingLoading } =
    useAddUsersAssesment();
  const [selectedRowIds, __] = useAtom(selectedRowIdsAtom);
  const [unSelectedRowIds, ___] = useAtom(unSelectedRowIdsAtom);
  const [selectAll, ____] = useAtom(selectAllAtom);
  const isLastIndex = activeTabIndex === 2;
  const navigate = useNavigate();
  const renderStep = () => {
    switch (activeTabIndex) {
      case 0:
        return <DetailsTab />;
      case 1:
        return <QuestionnaireTab />;
      case 2:
        return <UserSelected />;
      default:
        return <></>;
    }
  };

  const { isOpen, onOpen } = useDisclosure();
  const type = window.location.pathname.includes("edit") ? "Edit" : "Add";
  const [assesmentData, setAssesmentData] = useAtom(assesmentDataAtom);
  const [errorData, _] = useAtom(errorAtom);
  const emails = useAtomValue(emailsAtom);
  const fileError = useAtomValue(fileErrorAtom);
  const [bulkQuestions, setBulkQuestions] = useAtom(bulkUploadQuestionsAtom);
  const [uploadType, setUploadType] = useAtom(bulkUploadType);
  const {
    mutate: addBulkAssesmentMutate,
    isLoading: isAddBulkAssesmentLoading,
  } = useAddBulkAssessment();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateAssesment();
  const { mutate: createMutate, isLoading: isCreateLoading } =
    useCreateAssesment();

  const isDisabled = () => {
    if (activeTabIndex === 0) {
      return !(
        assesmentData?.name &&
        assesmentData?.end_date &&
        assesmentData?.start_date &&
        assesmentData?.loanCategory &&
        assesmentData?.passing_score &&
        isEmptyObject(errorData)
      );
    } else if (activeTabIndex === 1) {
      if (uploadType === "csv") return !(!fileError && bulkQuestions?.length);
      else if (uploadType === "ai") return !bulkQuestions?.length;
      return (assesmentData?.questions?.length || 0) <= 0;
    }
    return !(selectAll || selectedRowIds.size > 0 || emails.length > 0);
  };

  const onDetailSave = () => {
    if (assesmentData) {
      const payload = {
        id: assesmentData?.id,
        loan_category_id: assesmentData?.loanCategory,
        assessment_name: assesmentData?.name,
        start_date: format(
          new Date(assesmentData?.start_date),
          "yyyy-MM-dd'T'HH:mm"
        ),
        end_date: format(
          new Date(assesmentData?.end_date),
          "yyyy-MM-dd'T'HH:mm"
        ),
        passing_score: assesmentData?.passing_score,
        description: assesmentData?.description,
      };
      if (type === "Edit") {
        //@ts-ignore
        updateMutate(payload, {
          onSuccess() {
            setActiveTabIndex((e) => e + 1);
          },
        });
      } else {
        //@ts-ignore
        createMutate(payload, {
          onSuccess(successData) {
            setAssesmentData(successData);
            navigate(
              `${BASE_ROUTES[userType]}/assessment/edit/${successData?.id}`
            );
            setActiveTabIndex((e) => e + 1);
          },
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      setAssesmentData(data);
    }
  }, [data]);

  if (isLoading || (id && isEmptyObject(assesmentData || {}))) {
    return (
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        gap={"20px"}
        flexDir={"column"}
      >
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[24, 31, 700]}>Assessments</CustomText>
        </Flex>
        <Flex w={"full"} justifyContent={"center"}>
          <Spinner />
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <Flex
        w="full"
        flexDir={"column"}
        p={"24px"}
        flexGrow={1}
        overflowY={"auto"}
        gap={"24px"}
        h={"full"}
        alignItems={"center"}
        borderRadius={"16px"}
        bgColor={systemColors.white.absolute}
      >
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
          <CustomText stylearr={[24, 31, 700]}>{type} Assessment</CustomText>
          <Flex gap={"20px"}>
            <CustomButton
              borderRadius={"10px"}
              onClick={() => {
                if (isLastIndex) {
                  if (assesmentData) {
                    userMappingMutate(
                      {
                        loan_category_id: assesmentData?.loanCategory,
                        assessment_id: assesmentData?.id,
                        user_id: Array.from(
                          selectAll ? unSelectedRowIds : selectedRowIds
                        ),
                        all_selected: selectAll,
                      },
                      {
                        onSuccess() {
                          onOpen();
                        },
                      }
                    );
                  }
                } else if (activeTabIndex === 0) {
                  setUploadType(null);
                  setBulkQuestions([]);
                  onDetailSave();
                } else {
                  if (bulkQuestions?.length) {
                    addBulkAssesmentMutate();
                  } else {
                    setActiveTabIndex((e) => e + 1);
                  }
                }
              }}
              rightIcon={<ChevronRightIcon fontSize={"24px"} />}
              rowGap={1}
              isLoading={
                (activeTabIndex === 0 &&
                  (isUpdateLoading || isCreateLoading)) ||
                (activeTabIndex === 3 && isUserMappingLoading) ||
                isAddBulkAssesmentLoading
              }
              isDisabled={isDisabled()}
            >
              {isLastIndex ? "Schedule and send" : "Save & Continue"}
            </CustomButton>
          </Flex>
        </Flex>
        <Flex py={"24px"} w={"full"}>
          <CustomStepper
            data={["Details", "Questionnaire ", "User Selection"]}
            activeTabIndex={activeTabIndex}
            setActiveTab={(index) => {
              if (index == 1) {
                setUploadType(null);
                setBulkQuestions([]);
              }
              setActiveTabIndex(index);
            }}
          />
        </Flex>
        <Divider />
        <Flex w={"full"}>{renderStep()}</Flex>
      </Flex>
      <AssignmentScheduledModal
        numberOfEmployee={45}
        isOpen={isOpen}
        onClose={() => {}}
      />
      <AiGenerateQuestionsModal
        categoryId={assesmentData?.loanCategory || ""}
      />
      <GenerateQuestionsProcessingModal />
    </>
  );
}

export default function AddAssesment() {
  return (
    <Provider>
      <AddAssesmentProvider />
    </Provider>
  );
}
