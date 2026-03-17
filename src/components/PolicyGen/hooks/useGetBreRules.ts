import { useSetAtom } from "jotai";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../auth";
import { API_BASE_URL } from "../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../utils/queryErrorHandler";
import { breRulesAtom } from "../pages/ThreadView/threadAtom";
import { useEffect } from "react";
import { BreRule } from "../pages/ThreadView/utils/interface";

export const getBreRuleKey = "/agents/bre_rules/files/:fileId";

export default function useGetBreRules(fileId: string) {
  const setBreRules = useSetAtom(breRulesAtom);

  const getRules = async (): Promise<BreRule[]> => {
    if (!fileId) {
      console.error("Invalid payload");
      return []; // Return empty array instead of undefined
    }
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + getBreRuleKey?.replace(":fileId", fileId);
    return axios.get(endpoint).then(({ data }) => data?.data);
  };

  const { data, isLoading, refetch } = useQuery(
    [getBreRuleKey, fileId],
    getRules,
    {
      onError: queryErrorHandler,
    }
  );

  useEffect(() => {
    if (data && data?.length) {
      setBreRules(data);
    }
  }, [data]);

  return { data, isLoading, refetch }; // Return query data and functions
}
