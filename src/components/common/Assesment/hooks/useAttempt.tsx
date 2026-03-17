import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { getAnalyticsEndpoint } from "../../../../hooks/useGetDashboardAnalytics";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";

export const getAttemptIdKey = `/assessment/{assessment_id}/attempt`;

async function getAttempt(id: string) {
  const endpoint =
    API_BASE_URL + getAttemptIdKey.replace("{assessment_id}", id);
  const axios = getProtectedAxios();
  return axios.post(endpoint, {}).then(({ data }) => data?.data);
}

export default function useAttempt() {
  const { mutate, isLoading } = useMutation(
    [getAttemptIdKey],
    (payload: { id: string }) => getAttempt(payload?.id),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.invalidateQueries(getAnalyticsEndpoint);
      },
    }
  );
  return { mutate, isLoading };
}
