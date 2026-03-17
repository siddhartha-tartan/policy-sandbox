import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { queryClient } from "../../../../ProviderWrapper";
import { getProtectedAxios } from "../../../../auth";
import { getAssesmentById } from "../../../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export interface UPDATE_QUESTION_PAYLOAD {
  question_text: string;
  marks?: number;
  id: string;
  is_deleted?: boolean;
  options?: {
    id?: string | null;
    option_text: string;
    is_correct: boolean;
    is_deleted: boolean;
  }[];
}
export const updateQuestionKey = `/assessment/:assessment_id/question/:question_id`;

export default function useUpdateQuestion() {
  const { id } = useParams();
  async function updateQuestion(payload: UPDATE_QUESTION_PAYLOAD) {
    if (!id) return Promise.reject(new Error("Assessment ID is required"));
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL +
      `${updateQuestionKey
        .replace(":assessment_id", id || "")
        .replace(":question_id", payload.id)}`;
    return axios.patch(endpoint, payload);
  }
  const { mutate, isLoading } = useMutation(
    [updateQuestionKey],
    (payload: UPDATE_QUESTION_PAYLOAD) => updateQuestion(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.refetchQueries(getAssesmentById);
      },
    }
  );
  return { mutate, isLoading };
}
