import { useState } from "react";
import CustomToast from "../../../../common/CustomToast";

export interface IDeleteBulkPolicy {
  category_ids?: string[];
  select_all: boolean;
  policy_ids: string[];
  policy_name?: string;
  policy_manager?: string[];
  policy_status?: string[];
}

export const bulkDeletePolicyKey = `/policy`;

export default function useDeleteBulkPolicies() {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: IDeleteBulkPolicy,
    options?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Policy Deleted Successfully!", "SUCCESS");
      setIsLoading(false);
      options?.onSuccess?.();
    }, 500);
  };

  return { mutate, isLoading };
}
