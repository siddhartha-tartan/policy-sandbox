import { useState } from "react";
import CustomToast from "../../CustomToast";
import { IUser } from "./useGetUsers";

export const updateUserKey = `/users/:user_id`;

export default function useUpdateUser() {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: IUser,
    options?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("User updated successfully", "SUCCESS");
      setIsLoading(false);
      options?.onSuccess?.();
    }, 500);
  };

  return { mutate, isLoading };
}
