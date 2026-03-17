import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";

export interface Variable {
  id: string;
  name: string;
  title: string;
  type: "integer" | "enum" | "boolean" | "float" | "string";
  min_value: number;
  max_value: number;
  values: string[];
  rules: {
    rule_id: string;
    rule_name: string;
    rule_description: string;
  }[];
}

interface VariablesResponse {
  status_code: number;
  message: string;
  data: Variable[];
}

const getUniqueVariablesEndpoint = "/agents/test-bed/rules/unique-variables";

export default function useGetVariables() {
  const fetchUniqueVariables = async (ruleIds: string[]) => {
    const axios = getProtectedAxios();
    const endpoint = API_BASE_URL + getUniqueVariablesEndpoint;

    const { data } = await axios.post<VariablesResponse>(endpoint, ruleIds);
    return data.data;
  };

  const { mutate, data, isLoading } = useMutation(
    [getUniqueVariablesEndpoint],
    ({ ruleIds }: { ruleIds: string[] }) => fetchUniqueVariables(ruleIds),
    {
      onError: queryErrorHandler,
    }
  );

  return {
    mutate,
    isLoading,
    data,
  };
}
