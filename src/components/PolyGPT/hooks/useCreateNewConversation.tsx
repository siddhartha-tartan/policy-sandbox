import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { getProtectedAxios } from "../../../auth";
import { queryClient } from "../../../ProviderWrapper";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import { PolicyGenDataResponse } from "../../PolicyGen/hooks/useGetPolicyGenData";
import usePolicyGenPolling from "../../PolicyGen/hooks/usePolicyGenPolling";
import { isLoadingAtom, queryAtom } from "../polygptAtom";
import { get_all_conversations } from "./useGetConversations";
import { get_all_messages } from "./useGetMessages";

interface CreateNewConversationPayload {
  prompt: string;
  file_ids?: string[] | null;
  conversation_id?: string;
}
interface IResponse extends PolicyGenDataResponse {
  conversation_id: string;
}

const create_conversation = "/agents/poly-gpt/async";
export default function useCreateNewConversation(shouldNavigate = false) {
  const navigate = useNavigate();
  const { mutate: startPolling } = usePolicyGenPolling();
  const setQuery = useSetAtom(queryAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  async function create(payload: CreateNewConversationPayload) {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + create_conversation;
    return axios
      .post(endpoint, payload)
      .then(({ data }) => data?.data as IResponse);
  }
  const { data, isLoading, mutate } = useMutation(
    [create_conversation],
    (payload: CreateNewConversationPayload) => create(payload),
    {
      onError(err) {
        queryErrorHandler(err);
        setIsLoading(false);
      },
    }
  );

  useEffect(() => {
    if (data?.id && data?.conversation_id) {
      setIsLoading(true);
      startPolling(
        { requestId: data?.id },
        {
          onSuccess() {
            setIsLoading(false);
            queryClient.invalidateQueries(get_all_conversations);
            queryClient.invalidateQueries(get_all_messages);
            if (shouldNavigate) navigate(`${data?.conversation_id}`);
            setQuery("");
          },
          onError() {
            setIsLoading(false);
          },
        }
      );
    }
  }, [data]);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    }
  }, [isLoading]);

  return { data, isLoading, mutate };
}
