import { CloseButton, Flex, useDisclosure } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useReducer } from "react";
import CustomModal from "../../../../../../components/common/CustomModal";
import useGetPolicyByCategory from "../../../../../../components/common/Policy/hooks/useGetPolicyByCategory";
import { systemColors } from "../../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../../components/DesignSystem/Typography/CustomText";
import AppInputs from "../../../../../../components/forms/AppInputs";
import { checkFormValidity } from "../../../../../../components/forms/utils/checkFormValidity";
import { formErrorsReducer } from "../../../../../../components/forms/utils/formErrorReducer";
import { formReducer } from "../../../../../../components/forms/utils/formReducer";
import EventBus from "../../../../../../EventBus";
import { AiGenerateQuestionStateAtom } from "../../../atom";
import useGenerateAiQuestions from "../hooks/useGenerateAiQuestions";
import {
  generateQuestionsFormConfig,
  generateQuestionsFormValidators,
} from "../utils/config";

export const EVENT_OPEN_GENERATE_QUESTIONS = "EVENT_OPEN_GENERATE_QUESTIONS";
export const EVENT_CLOSE_GENERATE_QUESTIONS = "EVENT_CLOSE_GENERATE_QUESTIONS";
export default function AiGenerateQuestionsModal({
  categoryId,
}: {
  categoryId: string;
}) {
  const { data, setPageSize } = useGetPolicyByCategory(categoryId);

  useEffect(() => {
    setPageSize(100);
  }, []);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate, isLoading } = useGenerateAiQuestions();
  const setState = useSetAtom(AiGenerateQuestionStateAtom);
  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_GENERATE_QUESTIONS, onOpen);
    EventBus.getInstance().addListener(EVENT_CLOSE_GENERATE_QUESTIONS, onClose);
    return () => {
      EventBus.getInstance().removeListener(onOpen);
      EventBus.getInstance().removeListener(onClose);
    };
  }, []);
  const [state, dispatchValue] = useReducer(formReducer, {});
  const [errors, dispatchError] = useReducer(formErrorsReducer, {});

  const formConfig = useMemo(() => {
    const policyOptions =
      data?.data?.map((item) => ({
        label: item?.name,
        value: item?.policy_file?.id,
      })) || [];
    return generateQuestionsFormConfig(policyOptions);
  }, [data?.data]);

  const disableSubmit = useMemo(() => {
    return checkFormValidity(errors, formConfig.formFields, state);
  }, [state, errors, formConfig]);

  return (
    <CustomModal
      w={"455px"}
      className="rounded-[16px] bg-white p-6 flex flex-col gap-6"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex className="justify-between items-center w-full">
        <Flex className="flex-col gap-3">
          <CustomText stylearr={[16, 18, 700]}>Create Assessment</CustomText>
          <CustomText stylearr={[14, 18, 500]} color={systemColors.black[600]}>
            Choose the criteria to build your assessment.
          </CustomText>
        </Flex>
        <CloseButton onClick={onClose} />
      </Flex>
      <Flex className="flex-col gap-6 w-full">
        <AppInputs
          formConfig={formConfig}
          formFields={formConfig.formFields}
          formValue={state}
          formErrors={errors}
          formValidators={generateQuestionsFormValidators}
          dispatchValue={dispatchValue}
          dispatchError={dispatchError}
        />
      </Flex>
      <Flex className="flex-row gap-6 w-full">
        <CustomButton variant="secondary" className="w-1/2" onClick={onClose}>
          Cancel
        </CustomButton>
        <CustomButton
          className="w-1/2"
          style={{
            background:
              "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
          }}
          isDisabled={disableSubmit}
          onClick={() => {
            setState(state);
            mutate(state, {
              onSuccess() {},
            });
          }}
          isLoading={isLoading}
        >
          Create
        </CustomButton>
      </Flex>
    </CustomModal>
  );
}
