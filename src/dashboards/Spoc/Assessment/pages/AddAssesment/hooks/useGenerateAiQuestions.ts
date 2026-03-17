import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../../auth";
import { PolicyGenDataResponse } from "../../../../../../components/PolicyGen/hooks/useGetPolicyGenData";
import usePolicyGenPolling from "../../../../../../components/PolicyGen/hooks/usePolicyGenPolling";
import EventBus from "../../../../../../EventBus";
import { API_BASE_URL } from "../../../../../../utils/constants/endpoints";
import { deserializeJson } from "../../../../../../utils/helpers/deserializeJson";
import { queryErrorHandler } from "../../../../../../utils/queryErrorHandler";
import { bulkUploadQuestionsAtom } from "../../../atom";
import { EVENT_CLOSE_GENERATE_QUESTIONS } from "../components/AiGenerateQuestionsModal";
import {
  EVENT_CLOSE_GENERATE_QUESTIONS_POLLING,
  EVENT_OPEN_GENERATE_QUESTIONS_POLLING,
} from "../components/GenerateQuestionsPollingModal";
import { IQuestions } from "../../IndivisualAssesment/hooks/useGetAssesment";

export const generateAiQuestionsKey = `/agents/create-assessment`;

export interface IRequestGenerateQuestions {
  file_ids: string[];
  no_of_questions: number;
  selected: IQuestions[];
  not_selected: IQuestions[];
}

const processQuestionResponse = (response: any) => {
  return response?.flatMap((item: any) => {
    return item?.questions?.map((questionObj: any) => {
      let correctAnswerId: string | null = null;
      let correctOption: string | null = null;

      const options = questionObj?.options?.map((option: any) => {
        const id = crypto.randomUUID();
        if (!correctAnswerId && questionObj.correctAnswer === option.label) {
          correctAnswerId = id;
          correctOption = option.label;
        }
        return {
          label: option.text,
          value: id,
        };
      });

      return {
        id: questionObj?.id,
        question: questionObj?.questionText,
        options,
        correctAnswer: correctAnswerId,
        type: "new",
        correctOption: correctOption,
      };
    });
  });
};

const handlePollingSuccess = (successData: any, setBulkQuestions: any) => {
  EventBus.getInstance().fireEvent(EVENT_CLOSE_GENERATE_QUESTIONS_POLLING);
  const response = deserializeJson(successData?.response, {});
  const questions = processQuestionResponse(response);
  setBulkQuestions(questions);
};

export default function useGenerateAiQuestions(onGenerateSuccess?: () => void) {
  const { mutate: startPolling } = usePolicyGenPolling();
  const setBulkQuestions = useSetAtom(bulkUploadQuestionsAtom);

  const generate = async (
    payload: IRequestGenerateQuestions
  ): Promise<PolicyGenDataResponse> => {
    let endpoint = `${API_BASE_URL}${generateAiQuestionsKey}`;
    const axios = getProtectedAxios();
    return axios.post(endpoint, payload).then(({ data }) => data?.data);
  };

  const { mutate, data, error, isLoading } = useMutation(
    (payload: IRequestGenerateQuestions) => generate(payload),
    {
      onError: queryErrorHandler,
    }
  );

  useEffect(() => {
    const requestId = data?.id;
    if (requestId) {
      EventBus.getInstance().fireEvent(EVENT_CLOSE_GENERATE_QUESTIONS);
      setTimeout(() => {
        EventBus.getInstance().fireEvent(EVENT_OPEN_GENERATE_QUESTIONS_POLLING);
      }, 300);

      startPolling(
        { requestId: requestId },
        {
          onSuccess: (successData) => {
            if (onGenerateSuccess) {
              onGenerateSuccess();
            }
            handlePollingSuccess(successData, setBulkQuestions);
          },
        }
      );
    }
  }, [data, setBulkQuestions, startPolling]);

  return {
    mutate,
    data,
    error,
    isLoading,
  };
}
