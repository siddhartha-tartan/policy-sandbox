import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../auth";
import { POLLING_INTERVAL, POLLING_LIMIT } from "../../../utils/constants/data";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import { PolicyGenDataResponse, PollingStatus } from "./useGetPolicyGenData";

export const pollingKey = "/requests/:requestId";

export default function usePolicyGenPolling() {
  const fetchPollingStatus = async (
    requestId: string
  ): Promise<PolicyGenDataResponse> => {
    if (!requestId) {
      console.error("No request_id in query params");
    }
    const endpoint =
      API_BASE_URL + pollingKey?.replace(":requestId", requestId);
    try {
      const response = await getProtectedAxios().get(endpoint);
      return response?.data?.data;
    } catch (error) {
      throw queryErrorHandler(error);
    }
  };

  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async ({ requestId }: { requestId: string }) => {
      if (!requestId) {
        console.error("No request_id provided for polling");
        return;
      }

      let status: PollingStatus = PollingStatus.PENDING;
      let attempts = 0;
      const maxHits = POLLING_LIMIT;

      while (status !== String(PollingStatus.SUCCESS) && attempts < maxHits) {
        try {
          const result = await fetchPollingStatus(requestId);
          status = result?.status;
          if (status === PollingStatus.SUCCESS) {
            return result;
          } else if (status === PollingStatus.FAILED) {
            throw new Error("Request failed");
          }
        } catch (error) {
          console.error("Polling error:", error);
          throw error;
        }

        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      }

      // If we've exhausted all attempts without success
      if (attempts >= maxHits) {
        throw new Error("Polling timeout - max attempts reached");
      }
    },
    {
      onError: queryErrorHandler,
    }
  );

  return {
    mutate,
    data,
    error,
    isLoading,
    isSuccess,
  };
}
