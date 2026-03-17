import { useState } from "react";
import CustomToast from "../../CustomToast";
import type { PolicyChange } from "../../../../mock/mockData";

export interface EDIT_POLICY {
  policy_name?: string;
  policy_files?: {
    file_name: string;
    id?: string;
  }[];
  description?: string;
  priority?: string;
  comment?: string;
  loan_category_id?: string;
  notify_users?: boolean;
  status?: string;
  validity?: string | null;
  changes?: PolicyChange[];
  change_type?: "new_upload" | "version_upload" | "inline_edit";
  modified_html?: string;
  original_html?: string;
}

export const editPolicyDetails = `/category/:category_id/policy/:policy_id`;

export default function useEditPolicy(
  _categoryIdDrop?: string,
  _policyIdDrop?: string
) {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: EDIT_POLICY,
    options?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Policy updated successfully!", "SUCCESS");
      setIsLoading(false);
      options?.onSuccess?.(_payload);
    }, 500);
  };

  return { mutate, isLoading };
}
