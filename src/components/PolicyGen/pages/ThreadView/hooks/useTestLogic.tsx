import { useAtomValue } from "jotai";
import { useMutation } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { rulesAtom } from "../../../atom";

export const testLogicKey = `/category/{category_id}/policy/{policy_id}/file/{file_id}/test-logic`;

export interface IResponse {
  status_code: string;
  data: {
    session_id: string;
    chat_id: string;
    request_id: string;
  };
  error?: string;
}
export default function useTestLogic() {
  const { policyId, categoryId, fileId } = useParams<{
    policyId: string;
    categoryId: string;
    fileId: string;
  }>();
  const rulesData = useAtomValue(rulesAtom);
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const testLogic = async (prompt: string) => {
    const endpoint =
      API_BASE_URL +
      testLogicKey
        .replace("{category_id}", categoryId!)
        .replace("{policy_id}", policyId!)
        .replace("{file_id}", fileId!) +
      `?session_id=${sessionId}`;
    const axios = getProtectedAxios();
    return axios
      .post(endpoint, { rules: rulesData, prompt })
      .then(({ data }) => data as IResponse);
  };
  const { mutate, isLoading, data } = useMutation(
    [testLogicKey],
    ({ prompt }: { prompt: string }) => testLogic(prompt),
    {
      onError: queryErrorHandler,
      onSuccess() {},
    }
  );
  return { mutate, isLoading, data: data as IResponse };
}
