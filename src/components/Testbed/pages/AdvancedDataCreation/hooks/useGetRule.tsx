import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";

interface Variable {
  id: string;
  name: string;
  title: string;
  description: string;
  variable_type: "enum" | "integer" | "boolean";
  min: string;
  max: string;
  possible_values: {
    id: string;
    value: string;
    source: "default" | "ai" | "manually";
  }[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  variables: Variable[];
}

interface Section {
  id: string;
  name: string;
  description: string;
  action: string;
  trigger: string;
  rules: Rule[];
}

const getVariableRule = `/agents/test-bed/file/{file_id}/rules`;

export default function useGetRule() {
  const { fileId } = useParams();
  const fetch = async () => {
    const axios = getProtectedAxios();
    const endpoint =
      API_BASE_URL + getVariableRule.replace("{file_id}", fileId || "");
    return axios.get(endpoint).then(({ data }) => data?.data as Section[]);
  };

  const { data, error, isLoading } = useQuery(
    [getVariableRule, fileId],
    fetch,
    {
      onError: queryErrorHandler,
    }
  );

  return { data, loading: isLoading, error: error as Error };
}
