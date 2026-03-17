import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../auth";
import { getSpocAnalyticsKey } from "../../../../dashboards/Spoc/Home/hooks/useGetAnalytics";
import { queryClient } from "../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../utils/queryErrorHandler";
import { getThreadKey } from "./useGetThread";

export interface REPLY_PAYLOAD {
  id: string;
  content: string;
}

export const threadReplyKey = `/category/{category_id}/discussion`;
export const threadDiscussionReplyKey = `/category/{category_id}/discussion/{discussion_id}/message`;
export default function useReply() {
  const { id } = useParams<{ id: string }>();
  async function reply(payload: REPLY_PAYLOAD) {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL +
      (payload.id ? threadDiscussionReplyKey : threadReplyKey)
        .replace("{category_id}", id || "")
        .replace("{discussion_id}", payload.id || "");
    return axios.post(endpoint, payload.id ? payload : { message: payload });
  }

  const { mutate, isLoading } = useMutation(
    [threadReplyKey],
    (payload: REPLY_PAYLOAD) => reply(payload),
    {
      onError(err) {
        queryErrorHandler(err);
      },
      onSuccess() {
        queryClient.refetchQueries(getThreadKey);
        queryClient.refetchQueries(getSpocAnalyticsKey);
      },
    }
  );
  return { mutate, isLoading };
}
