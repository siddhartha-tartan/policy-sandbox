import { useMutation } from "react-query";
import { queryClient } from "../../../../ProviderWrapper";
import { getProtectedAxios } from "../../../../auth";
import { getAssesmentById } from "../../../../dashboards/Spoc/Assessment/pages/IndivisualAssesment/hooks/useGetAssesment";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

interface IPayload {
  questionId: string;
  optionId: string;
}

export const getDeleteKey = `/assessment/question/:questionId/option/:optionId`;
export default function useDeleteOption() {
  async function deleteOption(payload: IPayload) {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL +
      getDeleteKey
        .replace(":questionId", payload.questionId)
        .replace(":optionId", payload.optionId);
    return axios.delete(endpoint);
  }

  const { mutate, isLoading } = useMutation(
    [],
    (payload: IPayload) => deleteOption(payload),
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
