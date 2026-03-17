import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../auth";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";

interface Conversation {
  conversation_id: string;
  title: string;
  created_date: string;
}

export const get_all_conversations = "/conversation";
export default function useGetConversations() {
  async function getConversations(): Promise<Conversation[]> {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + get_all_conversations;
    return axios.get(endpoint).then(({ data }) => data?.data as Conversation[]);
  }

  const { data, isLoading } = useQuery(
    [get_all_conversations],
    () => getConversations(),
    {
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );
  return { data, isLoading };
}
