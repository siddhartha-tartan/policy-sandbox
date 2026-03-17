import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../auth";
import { getLoanCategoryKey } from "../../../../hooks/useGetLoanCategories";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import CustomToast from "../../CustomToast";
import { getArchivePolicyEndpoint } from "./useGetArchivePolicy";
import { getPoliciesByCategoryEndpoint } from "./useGetPolicyByCategory";

export const archivePolicyKey = `/category/:category_id/policy/archival`;

export interface IArchivePolicy {
  all_selected: boolean;
  policy_ids: string[];
  categoryId: string;
}

async function archivePolicy(payload: IArchivePolicy) {
  const axios = getProtectedAxios();
  const endpoint =
    API_BASE_URL + archivePolicyKey.replace(":category_id", payload.categoryId);

  const body = {
    all_selected: payload.all_selected,
    policy_ids: payload.policy_ids,
    archival_status: "Archive",
  };
  return axios.put(endpoint, body);
}

export default function useArchivePolicy() {
  const { customToast } = CustomToast();
  const { mutate, isLoading } = useMutation(
    [archivePolicyKey],
    (payload: IArchivePolicy) => archivePolicy(payload),
    {
      onError: queryErrorHandler,
      onSuccess() {
        customToast("Policy Archived!", "SUCCESS");
        queryClient.refetchQueries(getArchivePolicyEndpoint);
        queryClient.refetchQueries(getPoliciesByCategoryEndpoint);
        queryClient.refetchQueries(getLoanCategoryKey);
      },
    }
  );
  return { mutate, isLoading };
}
