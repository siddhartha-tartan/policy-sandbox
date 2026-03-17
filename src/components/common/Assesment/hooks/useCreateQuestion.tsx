import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../auth";
import { getAssesmentById } from "../../../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface CREATE_QUESTION_PAYLOAD {
  question_text: string;
  marks?: number;
  options: {
    option_text: string;
    is_correct: boolean;
  }[];
  assessment_id: string;
}
export const createQuestionKey = `/assessment/:assessment_id/question`;

export default function useCreateQuestion() {
  const { id } = useParams();
  async function createQuestion(payload: CREATE_QUESTION_PAYLOAD) {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL +
      `${createQuestionKey.replace(
        ":assessment_id",
        payload.assessment_id || id || ""
      )}`;
    return axios.post(endpoint, payload);
  }
  const { mutate, isLoading } = useMutation(
    [createQuestionKey],
    (payload: CREATE_QUESTION_PAYLOAD) => createQuestion(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(getAssesmentById);
      },
    }
  );
  return { mutate, isLoading };
}
