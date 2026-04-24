import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { getProtectedAxios } from "../../../auth";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import { PolicyGenDataResponse } from "../../PolicyGen/hooks/useGetPolicyGenData";
import usePolicyGenPolling from "../../PolicyGen/hooks/usePolicyGenPolling";
import {
  activeTabAtom,
  chatAtom,
  ChatMessage,
  ChartConfig,
  isLoadingAtom,
  queryAtom,
  selectedChatIndexAtom,
} from "../utils/atom";
import { QUERYGEN2_SUB_ROUTES } from "../utils/constant";
import { executeQuery } from "../utils/mockQueryEngine";

const USE_MOCK_DATA = true;

interface GenerateQueryResponsePayload {
  user_query: string;
  data_source: string;
  query_history: { text: string; executed_at_ms: number }[];
}

interface ParsedResponse {
  message: string;
  title: string;
  sql_query: string;
  result: Record<string, unknown>[] | Record<string, unknown>;
  insights?: string;
  chart_config?: ChartConfig;
}

const generate_query_response = "/agents/query-generation";

export default function useGenerateQueryResponse(shouldNavigate = false) {
  const navigate = useNavigate();
  const { mutate: startPolling } = usePolicyGenPolling();
  const setQuery = useSetAtom(queryAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const [chat, setChat] = useAtom(chatAtom);
  const setSelectedChatIndex = useSetAtom(selectedChatIndexAtom);
  const setActiveTab = useSetAtom(activeTabAtom);
  const currentQueryRef = useRef<string>("");

  const handleMockSubmit = (payload: GenerateQueryResponsePayload) => {
    currentQueryRef.current = payload.user_query;
    setIsLoading(true);

    setTimeout(() => {
      const mockResponse = executeQuery(payload.user_query, payload.query_history);
      const newMessage: ChatMessage = {
        query: currentQueryRef.current,
        message: mockResponse.message,
        title: mockResponse.title,
        sql_query: mockResponse.sql_query,
        result: JSON.stringify(mockResponse.result),
        executed_at_ms: new Date().getTime().toString(),
        chart_config: mockResponse.chart_config,
        insights: mockResponse.insights,
      };
      setChat((prev) => {
        const newChat = [...prev, newMessage];
        setSelectedChatIndex(newChat.length - 1);
        return newChat;
      });
      setActiveTab(mockResponse.chart_config ? "chart" : "result");
      setIsLoading(false);
      setQuery("");
      if (shouldNavigate) navigate(QUERYGEN2_SUB_ROUTES.THREAD);
    }, 5000);
  };

  async function create(payload: GenerateQueryResponsePayload) {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + generate_query_response;
    currentQueryRef.current = payload.user_query;
    return axios
      .post(endpoint, payload)
      .then(({ data }) => data?.data as PolicyGenDataResponse);
  }

  const { data, isLoading, mutate } = useMutation(
    [generate_query_response],
    (payload: GenerateQueryResponsePayload) => create(payload),
    {
      onError(err) {
        queryErrorHandler(err);
        setIsLoading(false);
      },
    }
  );

  useEffect(() => {
    if (data?.id) {
      setIsLoading(true);
      startPolling(
        { requestId: data?.id },
        {
          onSuccess(successData) {
            setIsLoading(false);

            // Parse the response and append to chatAtom
            if (successData?.response) {
              try {
                const parsed: ParsedResponse = JSON.parse(successData.response);
                const newMessage: ChatMessage = {
                  query: currentQueryRef.current,
                  message: parsed.message || "",
                  title: parsed.title || "",
                  sql_query: parsed.sql_query || "",
                  result: JSON.stringify(parsed.result || {}),
                  executed_at_ms: new Date().getTime().toString(),
                  chart_config: parsed.chart_config,
                  insights: parsed.insights,
                };
                setChat((prev) => {
                  const newChat = [...prev, newMessage];
                  // Auto-select the new message
                  setSelectedChatIndex(newChat.length - 1);
                  return newChat;
                });
              } catch (error) {
                console.error("Failed to parse response:", error);
              }
            }

            if (shouldNavigate) navigate(QUERYGEN2_SUB_ROUTES.THREAD);
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

  // Helper to build query_history from chatAtom
  const buildQueryHistory = () => {
    return chat.map((item) => ({
      text: item.query,
      executed_at_ms: parseInt(item.executed_at_ms, 10) || 0,
    }));
  };

  // Return mock mutate if in mock mode
  const mockMutate = USE_MOCK_DATA ? handleMockSubmit : mutate;

  return { data, isLoading, mutate: mockMutate, buildQueryHistory };
}
