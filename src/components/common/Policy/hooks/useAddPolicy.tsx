import { useState } from "react";
import CustomToast from "../../CustomToast";
import type { PolicyChange } from "../../../../mock/mockData";

export interface EDIT_POLICY {
  policy_name: string;
  policy_files?: {
    file_name: string;
    id?: string;
  }[];
  description: string;
  priority?: string;
  comment?: string;
  loan_category_id: string;
  notify_users: boolean;
  validity?: string | null;
  changes?: PolicyChange[];
  change_type?: "new_upload" | "version_upload" | "inline_edit";
  modified_html?: string;
  original_html?: string;
}

export const addPolicyDetails = `/category/:category_id/policy`;

export default function useAddPolicy() {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: EDIT_POLICY,
    options?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      const result = { id: `pol-new-${Date.now()}`, ..._payload };
      customToast("Policy added successfully!", "SUCCESS");
      setIsLoading(false);
      options?.onSuccess?.(result);
    }, 500);
  };

  return { mutate, isLoading };
}
