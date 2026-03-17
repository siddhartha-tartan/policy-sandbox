import { useAtom } from "jotai";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../auth";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import { conversationAtom } from "../polygptAtom";

export interface ConversationMessage {
  message_id: string;
  prompt: string;
  response: {
    chat_title: string;
    query_response: string;
    files: {
      id: string;
      category_id: string;
      policy_id: string;
      file_name: string;
      page_numbers: number[];
    }[];
  };
}

export interface ConversationMessages {
  conversation_id: string;
  title: string;
  created_date: string;
  conversation_message: ConversationMessage[];
}

export const get_all_messages = "/conversation/{conversation_id}/messages";
export default function useGetMessages() {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useAtom(conversationAtom);
  async function fetch(): Promise<ConversationMessages> {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL + get_all_messages?.replace("{conversation_id}", id ?? "");
    return axios
      .get(endpoint)
      .then(({ data }) => data?.data as ConversationMessages);
  }

  const { data, isLoading } = useQuery([get_all_messages, id], () => fetch(), {
    onError(err) {
      queryErrorHandler(err);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (isLoading && !(conversation?.length > 0)) {
      setConversation([]);
    }
  }, [isLoading]);

  useEffect(() => {
    setConversation(data?.conversation_message || []);
  }, [data]);

  return { data, isLoading };
}
