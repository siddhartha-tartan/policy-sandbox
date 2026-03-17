import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { PolicyGenDataResponse } from "../../../hooks/useGetPolicyGenData";

export const askQueryKey = `/agents/user-query/files/:fileId`;

export default function useAskQuery() {
  const { fileId } = useParams<{
    fileId: string;
  }>();

  const askQuery = async (prompt: string): Promise<PolicyGenDataResponse> => {
    const endpoint = API_BASE_URL + askQueryKey.replace(":fileId", fileId!);
    const axios = getProtectedAxios();
    return axios.post(endpoint, { prompt }).then(({ data }) => data?.data);
  };
  const { mutate, isLoading, data } = useMutation(
    [askQueryKey],
    ({ prompt }: { prompt: string }) => askQuery(prompt),
    {
      onError: queryErrorHandler,
    }
  );
  return { mutate, isLoading, data };
}
