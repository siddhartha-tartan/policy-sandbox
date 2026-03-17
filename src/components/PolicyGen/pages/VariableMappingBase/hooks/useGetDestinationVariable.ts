import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { destinationVariablesAtom } from "../atom";

export const getDestinationVariableKey = "/bre-variables/unmapped";

export default function useGetDestinationVariables() {
  const setData = useSetAtom(destinationVariablesAtom);
  const [searchQuery, setSearchQuery] = useState<string>("");
  async function fetch(): Promise<string[]> {
    let queryParams: string[] = [];

    if (searchQuery)
      queryParams.push(`search_variable=${encodeURIComponent(searchQuery)}`);

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    const endpoint = API_BASE_URL + getDestinationVariableKey + queryString;

    const axios = getProtectedAxios();
    return axios.get(endpoint).then(({ data }) => data?.data);
  }
  const { data, isLoading } = useQuery(
    [getDestinationVariableKey, searchQuery],
    fetch,
    {
      onError(err) {
        queryErrorHandler(err);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  return { isLoading, searchQuery, setSearchQuery };
}
