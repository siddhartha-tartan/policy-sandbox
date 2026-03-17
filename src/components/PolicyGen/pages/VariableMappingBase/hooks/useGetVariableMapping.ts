import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";

export interface IDestinationVariable {
  id: string;
  destination_variable: string | null;
  data_type: string;
  description: string;
}

export interface IVariable {
  id: string;
  destination_variable?: string | null;
  data_type: string;
  description: string;
  source_variable: string;
}

interface IResponse {
  mapped_variables: IVariable[];
  unmapped_variables: IVariable[];
}

export const getVariableMappingKey = "/bre-variables";

export default function useGetVariableMapping() {
  const { fileId } = useParams<{
    fileId: string;
  }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<string>("");
  async function fetch(): Promise<IResponse> {
    let queryParams: string[] = [];

    if (searchQuery)
      queryParams.push(`search_variable=${encodeURIComponent(searchQuery)}`);
    if (filters?.length) {
      queryParams.push(`data_types=${encodeURIComponent(filters)}`);
    }
    if (fileId) {
      queryParams.push(`file_id=${encodeURIComponent(fileId)}`);
    }

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + getVariableMappingKey + queryString;

    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  }
  const [result, setResult] = useState<
    Record<
      "mapped_variables" | "unmapped_variables",
      Record<string, IDestinationVariable> | null
    >
  >({ mapped_variables: null, unmapped_variables: null });
  const { data, isLoading } = useQuery(
    [getVariableMappingKey, searchQuery, filters, fileId],
    fetch,
    {
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );

  useEffect(() => {
    if (data) {
      const mappedVariables = data?.mapped_variables?.reduce((acc, item) => {
        const { source_variable, ...rest } = item;
        //@ts-ignore
        acc[source_variable] = rest;
        return acc;
      }, {} as Record<string, IDestinationVariable>);

      const unmappedVariables = data?.unmapped_variables?.reduce(
        (acc, item) => {
          const { source_variable, ...rest } = item;
          //@ts-ignore
          acc[source_variable] = rest;
          return acc;
        },
        {} as Record<string, IDestinationVariable>
      );

      setResult({
        mapped_variables: mappedVariables,
        unmapped_variables: unmappedVariables,
      });
    }
  }, [data, data?.mapped_variables?.length, data?.unmapped_variables?.length]);

  return {
    data: result,
    isLoading,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  };
}
