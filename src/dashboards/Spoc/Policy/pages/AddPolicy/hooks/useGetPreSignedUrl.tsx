import { useSetAtom } from "jotai";
import { useState } from "react";
import CustomToast from "../../../../../../components/common/CustomToast";
import { isPresignedUploading } from "../../loadingAtom";

export interface IGetPreSigned {
  category_id: string;
  policy_id: string;
  file_id: string;
  file: File;
}

export const uploadPolicyKey = `/category/:category_id/policy/:policy_id/file/:file_id/upload`;

export default function useGetPreSignedUrl(message?: string) {
  const setPresignedUploading = useSetAtom(isPresignedUploading);
  const { customToast } = CustomToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    _payload: IGetPreSigned,
    options?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setPresignedUploading(true);
    setTimeout(() => {
      setPresignedUploading(false);
      setIsLoading(false);
      customToast(`Policy ${message || "created"} successfully`, "SUCCESS");
      options?.onSuccess?.({});
    }, 800);
  };

  return { mutate, isLoading };
}
