import { useSetAtom } from "jotai";
import { useMutation } from "react-query";
import { getProtectedAxios } from "../../../../../auth";
import { queryClient } from "../../../../../ProviderWrapper";
import { API_BASE_URL } from "../../../../../utils/constants/endpoints";
import { queryErrorHandler } from "../../../../../utils/queryErrorHandler";
import { variableParsedData } from "../atom";
import { getDestinationVariableKey } from "./useGetDestinationVariable";
import { getVariableMappingKey } from "./useGetVariableMapping";

export interface IAddDestinationVariable {
  destination_variable: string;
  data_type: string;
  description: string;
}

export const addDestinationVariable = `/bre-variables`;

export default function useAddDestinationVariable() {
  const setParsedData = useSetAtom(variableParsedData);
  const add = async (payload: IAddDestinationVariable[]) => {
    const endpoint = API_BASE_URL + addDestinationVariable;

    const axios = getProtectedAxios();
    return axios.post(endpoint, payload).then(({ data }) => data?.data);
  };
  const { mutate, isLoading } = useMutation(
    [addDestinationVariable],
    (payload: IAddDestinationVariable[]) => add(payload),
    {
      onError: queryErrorHandler,
      onSuccess() {
        setParsedData([]);
        queryClient.invalidateQueries(getDestinationVariableKey);
        queryClient.invalidateQueries(getVariableMappingKey);
      },
    }
  );
  return { mutate, isLoading };
}
