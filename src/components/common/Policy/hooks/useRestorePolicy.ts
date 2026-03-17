import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { getLoanCategoryKey } from "../../../../hooks/useGetLoanCategories";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import CustomToast from "../../CustomToast";
import { getArchivePolicyEndpoint } from "./useGetArchivePolicy";
import { getPoliciesByCategoryEndpoint } from "./useGetPolicyByCategory";

export const restorePolicyKey = `/category/:category_id/policy/archival`;

export interface IRestorePolicy {
  policy_ids: string[];
  categoryId: string;
}

async function restorePolicy(payload: IRestorePolicy) {
  const axios = getProtectedAxios();
  const endpoint =
    API_BASE_URL + restorePolicyKey.replace(":category_id", payload.categoryId);
  const body = {
    policy_ids: payload.policy_ids,
    archival_status: "Restore",
  };
  return axios.put(endpoint, body);
}

export default function useRestorePolicy() {
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useMutation(
    [restorePolicyKey],
    (payload: IRestorePolicy) => restorePolicy(payload),
    {
      onError: queryErrorHandler,
      onSuccess() {
        customToast("Policy Restored!", "SUCCESS");
        queryClient.refetchQueries(getArchivePolicyEndpoint);
        queryClient.refetchQueries(getPoliciesByCategoryEndpoint);
        queryClient.refetchQueries(getLoanCategoryKey);
      },
    }
  );
  return { mutate, isLoading };
}
