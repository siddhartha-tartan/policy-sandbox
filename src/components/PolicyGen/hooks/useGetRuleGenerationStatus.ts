import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../auth";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";

export const getRuleStatusKey = "/rules-status/files/:fileId";
export default function useGetRuleGenerationStatus(fileId: string) {
  async function getStatus(): Promise<{
    data: "Successful" | "Pending" | "Failed";
  }> {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + getRuleStatusKey.replace(":fileId", fileId);
    return axios.get(endpoint).then(({ data }) => data);
  }

  const { data, isLoading } = useQuery(
    [getRuleStatusKey, fileId],
    () => getStatus(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      refetchOnMount: "always",
    }
  );
  return { data, isLoading };
}
