import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { queryClient } from "../../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import useGetPolicyGenData, {
  PolicyGenData,
} from "../../../hooks/useGetPolicyGenData";
import { getchatPromptsKey } from "./useGetChatPrompts";

export const editRulesKey = `/agents/edit-rules/files/:fileId`;
interface RequestEditRulesBase {
  queryType: "manual_update" | "update";
}

export type RequestEditRules =
  | (RequestEditRulesBase & { prompt: string; rules?: never })
  | (RequestEditRulesBase & { rules: string; prompt?: never });

export default function useGetEditRules() {
  const { mutate: fetchGenData } = useGetPolicyGenData();
  const { fileId } = useParams<{
    fileId: string;
  }>();
  const editRules = async (payload: RequestEditRules): Promise<null> => {
    const endpoint = API_BASE_URL + editRulesKey.replace(":fileId", fileId!);
    const axios = getProtectedAxios();
    const body = {
      query_type: payload?.queryType,
      ...(payload?.prompt
        ? { prompt: payload.prompt }
        : { rules: payload.rules }),
    };
    return axios.post(endpoint, body).then(({ data }) => {
      fetchGenData(
        { queryType: PolicyGenData.RULES, fileId: fileId! },
        {
          onSuccess() {
            queryClient.refetchQueries(getchatPromptsKey);
          },
        }
      );
      fetchGenData(
        { queryType: PolicyGenData.SUMMARY, fileId: fileId! },
        {
          onSuccess() {
            queryClient.refetchQueries(getchatPromptsKey);
          },
        }
      );
      return data?.data;
    });
  };

  const { mutate, isLoading, data } = useMutation(
    [editRulesKey],
    (payload: RequestEditRules) => editRules(payload),
    {
      onError: queryErrorHandler,
    }
  );
  return { mutate, isLoading, data };
}
