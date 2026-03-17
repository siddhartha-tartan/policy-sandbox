import { useState } from "react";
import CustomToast from "../../../../CustomToast";

export interface IAddComment {
  request_id: string;
  comment: string;
}

export const addCommentKey = `/approvals/comment`;

export default function useAddComment() {
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: IAddComment,
    options?: { onSuccess?: () => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      customToast("Comment created successfully.", "SUCCESS");
      setIsLoading(false);
      options?.onSuccess?.();
    }, 400);
  };

  return { mutate, isLoading };
}
