import { useState } from "react";
import { MOCK_POLICY_CONTENTS } from "../../../../mock/mockData";

export interface GET_PRE_SIGNED {
  category_id: string;
  policy_id: string;
  file_id: string;
}

export const uploadPolicyKey = `/category/:category_id/policy/:policy_id/file/:file_id/download`;

export default function useGetFile() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = (
    payload: GET_PRE_SIGNED,
    options?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }
  ) => {
    setIsLoading(true);
    setTimeout(() => {
      const htmlContent = MOCK_POLICY_CONTENTS[payload.file_id] || MOCK_POLICY_CONTENTS["file-001"];
      const result = {
        htmlContent,
        file_name: `policy_${payload.policy_id}.docx`,
      };
      setData(result);
      setIsLoading(false);
      options?.onSuccess?.(result);
    }, 300);
  };

  return { mutate, isLoading, data };
}
