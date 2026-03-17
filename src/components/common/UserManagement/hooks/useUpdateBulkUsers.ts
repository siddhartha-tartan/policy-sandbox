import { useState } from "react";
import CustomToast from "../../CustomToast";
import { IAddUser } from "./useAddUsers";

export const updateUserKey = `/users/bulk`;

export interface IUpdateBulkUsers {
  users?: IAddUser[];
  filters?: {
    select_all?: boolean;
    exclude_user_ids?: string[];
    user_ids?: string[];
    category_ids?: string[];
    user_types?: string[];
    is_active?: boolean;
    search_term?: string;
    feature_ids?: string[];
    start_date?: Date | null;
    end_date?: Date | null;
  };
  global_feature_ids?: string[];
}

export default function useUpdateBulkUsers(
  successCallback?: () => void,
  _isAsync?: boolean
) {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: IUpdateBulkUsers,
    options?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("User updated successfully", "SUCCESS");
      setIsLoading(false);
      successCallback?.();
      options?.onSuccess?.();
    }, 500);
  };

  return { mutate, isLoading };
}
