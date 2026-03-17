import { useSetAtom } from "jotai";
import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../auth";
import { POLLING_INTERVAL, POLLING_LIMIT } from "../../../utils/constants/data";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import { rulesAtom, summaryAtom } from "../atom";

export interface PolicyGenDataResponse {
  id: string;
  agent_id: string;
  context_id: string;
  request: string;
  metadata: string;
  status: PollingStatus;
  response: string;
  result?: string;
}

export interface PolicyGenPollingRequest {
  queryType: PolicyGenData;
  fileId: string;
}

export enum PollingStatus {
  PENDING = "Pending",
  SUCCESS = "Successful",
  FAILED = "Failed",
}

export enum PolicyGenData {
  RULES = "Rules",
  SUMMARY = "Summary",
}

export const Empty = "empty";
export const getPolicyGenDataKey = "/agents/:agentName/requests/:fileId";

export default function useGetPolicyGenData() {
  const axios = getProtectedAxios();
  const setRules = useSetAtom(rulesAtom);
  const setSummary = useSetAtom(summaryAtom);
  // const [isRulesLoading, setIsRulesLoading] = useAtom(rulesLoadingAtom);
  // const [isSummaryLoading, setIsSummaryLoading] = useAtom(summaryLoadingAtom);

  // const isFetching = (type: PolicyGenData) => {
  //   if (type === PolicyGenData.RULES) return isRulesLoading;
  //   else if (type === PolicyGenData.SUMMARY) return isSummaryLoading;
  //   else return false;
  // };

  // const updateLoadingState = (queryType: PolicyGenData, state: boolean) => {
  //   const stateUpdater: Record<PolicyGenData, (value: boolean) => void> = {
  //     [PolicyGenData.RULES]: (value) => setIsRulesLoading(value),
  //     [PolicyGenData.SUMMARY]: (value) => setIsSummaryLoading(value),
  //   };
  //   stateUpdater[queryType]?.(state);
  // };

  const updateData = (queryType: PolicyGenData, data: string) => {
    const stateUpdater: Record<PolicyGenData, (value: string) => void> = {
      [PolicyGenData.RULES]: (value) => {
        try {
          const jsonData = JSON.parse(value);
          setRules(jsonData);
        } catch (error) {
          console.error("Failed to parse Rules JSON:", error);
          setRules(null);
        }
      },
      [PolicyGenData.SUMMARY]: (value) => {
        setSummary(value);
      },
    };

    stateUpdater[queryType]?.(data);
  };

  const fetchPollingStatus = async (
    payload: PolicyGenPollingRequest
  ): Promise<PolicyGenDataResponse> => {
    const endpoint =
      API_BASE_URL +
      getPolicyGenDataKey
        .replace(":agentName", payload?.queryType)
        .replace(":fileId", payload?.fileId);
    try {
      const response = await axios.get(endpoint);
      return response.data?.data;
    } catch (error) {
      throw queryErrorHandler(error);
    }
  };

  const { mutate, data, error, isLoading, isSuccess } = useMutation(
    async (payload: PolicyGenPollingRequest) => {
      if (!payload?.queryType || !payload?.fileId) {
        console.error("Invalid payload");
        return;
      }
      // if (isFetching(payload.queryType)) {
      //   console.error("Fetching in Progress");
      //   return;
      // }
      // updateLoadingState(payload.queryType, true);

      let status: PollingStatus = PollingStatus.PENDING;
      let attempts = 0;
      const maxHits = POLLING_LIMIT;
      while (status !== String(PollingStatus.SUCCESS) && attempts < maxHits) {
        try {
          const result = await fetchPollingStatus(payload);
          status = result?.status;

          if (status === PollingStatus.SUCCESS) {
            // updateLoadingState(payload.queryType, false);
            updateData(payload.queryType, result?.response);
            return result;
          } else if (status === PollingStatus.FAILED) {
            // updateLoadingState(payload.queryType, false);
            return;
          }
        } catch (error) {
          console.error("Polling error:", error);
          break;
        }

        attempts += 1;
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      }
      if (attempts >= maxHits) {
        // updateLoadingState(payload.queryType, false);
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
