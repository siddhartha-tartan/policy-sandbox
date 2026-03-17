import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";

export const getchatPromptsKey = "/conversation-history/files/:fileId";

export interface ChatResponse {
  prompt: string;
  response: string;
}

export default function useGetChatPrompts() {
  const { fileId } = useParams<{
    fileId: string;
  }>();
  async function fetch(): Promise<ChatResponse[]> {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL + getchatPromptsKey.replace(":fileId", fileId!);
    return axios.get(endpoint).then(({ data }) => data?.data);
  }

  const { data, isLoading } = useQuery([getchatPromptsKey], () => fetch(), {
    onError: queryErrorHandler,
  });

  return { data, isLoading };
}
