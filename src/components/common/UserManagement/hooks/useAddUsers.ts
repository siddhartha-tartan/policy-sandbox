import { useState } from "react";
import { UserType } from "../../../../utils/constants/constants";
import CustomToast from "../../CustomToast";
import { IUserCategoryAccess } from "./useGetUsers";

export interface IAddUser {
  source_employee_id: string;
  first_name: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  loan_category_access: IUserCategoryAccess[] | null;
  feature_ids: string[];
  query_permission?: boolean;
}

export const addUserKey = `/users/bulk`;

export default function useAddUsers(
  successCallback?: () => void,
  _isAsync?: boolean
) {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (_payload: IAddUser[]) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("User added successfully", "SUCCESS");
      setIsLoading(false);
      successCallback?.();
    }, 500);
  };

  return { mutate, isLoading };
}
