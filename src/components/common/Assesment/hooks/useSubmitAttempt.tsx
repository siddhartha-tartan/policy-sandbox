import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../auth";
import { getAnalyticsEndpoint } from "../../../../hooks/useGetDashboardAnalytics";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { pendingAssesmentkey } from "./useGetAttemptAssesment";
import { getPastAssesmentKey } from "./useGetPastAssesments";

export const getSubmitAttemptIdKey = `/assessment/{assessment_id}/answer/{attempt_id}`;
interface PAYLOAD {
  question_id: string;
  option_id: string;
}

export default function useSubmitAttempt() {
  const { id } = useParams<{ id: string }>();
  const params = new URLSearchParams(window.location.search);
  const attempt_id = params.get("attempt_id") || "";
  async function submit(payload: PAYLOAD) {
    const endpoint =
      API_BASE_URL +
      getSubmitAttemptIdKey
        .replace("{assessment_id}", id || "")
        .replace("{attempt_id}", attempt_id);
    const axios = getProtectedAxios();
    return axios.post(endpoint, payload).then(({ data }) => data?.data);
  }

  const { mutate, isLoading } = useMutation(
    [getSubmitAttemptIdKey],
    (payload: PAYLOAD) => submit(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(pendingAssesmentkey);
        queryClient.invalidateQueries(getPastAssesmentKey);
        queryClient.invalidateQueries(getAnalyticsEndpoint);
      },
    }
  );
  return { mutate, isLoading };
}
